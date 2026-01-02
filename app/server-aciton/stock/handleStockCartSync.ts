"use server";

import { prisma } from "@/lib/prisma/prisma";
import { Stock } from "@prisma/client";

export const handleStockCartSync = async (stock: Stock) => {

    if(stock.minQuantity === null) {
        return;
    }

  // 名前が"在庫不足"のショッピングカートを取得
  const shoppingCart = await prisma.shoppingCart.findFirst({
    where: {
      userId: "test-user-id",
      name: "在庫不足",
    },
  });

  // ショッピングカートが存在する場合
  if (shoppingCart) {
    // stockの在庫数がminQuantity以上であれば、ショッピングカートから削除
    if (stock.minQuantity !== null && stock.quantity >= stock.minQuantity) {
      const cartItemDelete = await prisma.shoppingCartItem.findFirst({
        where: {
          stockId: stock.id,
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
      const remainingCount = await prisma.shoppingCartItem.count({
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
          stockId: stock.id,
          cartId: shoppingCart.id,
        },
      });
      if (!existingCartItem) {
        await prisma.shoppingCartItem.create({
          data: {
            itemName: stock.name,
            quantity: (stock.minQuantity || 0) - stock.quantity,
            unit: stock.unit,
            unitPrice: stock.unitPrice || 0,
            stockId: stock.id,
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
            quantity: (stock.minQuantity || 0) - stock.quantity,
          },
        });
      }
    }
  }
  // ショッピングカートが存在しない場合はカートを作成し、追加する
  else if (stock.minQuantity !== null && stock.quantity < stock.minQuantity) {
    const newCart = await prisma.shoppingCart.create({
      data: {
        userId: "test-user-id",
        name: "在庫不足",
      },
    });

    await prisma.shoppingCartItem.create({
      data: {
        itemName: stock.name,
        quantity: (stock.minQuantity || 0) - stock.quantity,
        unit: stock.unit,
        unitPrice: stock.unitPrice || 0,
        stockId: stock.id,
        cartId: newCart.id,
      },
    });
  }
};
