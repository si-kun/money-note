"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const updateStockQuantity = async (
  stockId: string,
  newQuantity: number
): Promise<ApiResponse<null>> => {
  try {
    // 在庫数を更新
    const targetItem = await prisma.stock.update({
      where: { id: stockId },
      data: {
        quantity: newQuantity,
      },
    });

    // 名前が"在庫不足"のショッピングカートを取得
    const shoppingCart = await prisma.shoppingCart.findFirst({
      where: {
        userId: "test-user-id",
        name: "在庫不足",
      },
    });

    // ショッピングカートが存在する場合
    if (shoppingCart) {
      // targetItemの在庫数がminQuantity以上であれば、ショッピングカートから削除
      if (
        targetItem.minQuantity !== null &&
        targetItem.quantity >= targetItem.minQuantity
      ) {
        const cartItemDelete = await prisma.shoppingCartItem.findFirst({
          where: {
            stockId: targetItem.id,
            cartId: shoppingCart.id,
          },
        });

        if (cartItemDelete) {
          await prisma.shoppingCartItem.delete({
            where: {
              id: cartItemDelete.id,
            },
          });
        }
        // ショッピングカートが空になったらカートを削除する
        const remainingCount  = await prisma.shoppingCartItem.count({
          where: {
            cartId: shoppingCart.id,
          },
        });
        if (remainingCount === 0) {
          await prisma.shoppingCart.delete({
            where: {
              id: shoppingCart.id,
            },
          });
        }
      }
      // 在庫が不足している場合かつショッピングカートに存在しない場合は追加する
      else {
        const existingCartItem = await prisma.shoppingCartItem.findFirst({
          where: {
            stockId: targetItem.id,
            cartId: shoppingCart.id,
          },
        });
        if (!existingCartItem) {
          await prisma.shoppingCartItem.create({
            data: {
              itemName: targetItem.name,
              quantity: (targetItem.minQuantity || 0) - targetItem.quantity,
              unit: targetItem.unit,
              unitPrice: targetItem.unitPrice || 0,
              stockId: targetItem.id,
              cartId: shoppingCart.id,
            },
          });
        }
        // すでに存在していたら更新する
        else {
          await prisma.shoppingCartItem.update({
            where: {
              id: existingCartItem.id,
            },
            data: {
              quantity: (targetItem.minQuantity || 0) - targetItem.quantity,
            },
          });
        }
      }
    }
    // ショッピングカートが存在しない場合はカートを作成し、追加する
    else if(targetItem.minQuantity !== null && targetItem.quantity < targetItem.minQuantity) {
      const newCart = await prisma.shoppingCart.create({
        data: {
          userId: "test-user-id",
          name: "在庫不足",
        },
      });

      await prisma.shoppingCartItem.create({
        data: {
          itemName: targetItem.name,
          quantity: (targetItem.minQuantity || 0) - targetItem.quantity,
          unit: targetItem.unit,
          unitPrice: targetItem.unitPrice || 0,
          stockId: targetItem.id,
          cartId: newCart.id,
        },
      });
    }

    revalidatePath("/stock");

    return {
      success: true,
      message: "在庫数を変更しました。",
      data: null,
    };
  } catch (error) {
    console.error("在庫数の増加中にエラーが発生しました:", error);
    return {
      success: false,
      message: "在庫数の増加に失敗しました。",
      data: null,
    };
  }
};
