const CartItem = (sequelize, DataTypes) => {
  const CartItemModel = sequelize.define('CartItem', {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['customerId', 'productId']
      }
    ]
  });
  return CartItemModel;
};

export default CartItem;
