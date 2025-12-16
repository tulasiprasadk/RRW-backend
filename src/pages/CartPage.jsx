// frontend/src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: qty } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const remove = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const checkout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">🛒 Your Shopping Cart</h2>
        
        {cart.length === 0 && (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="continue-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        )}

        {cart.length > 0 && (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  {item.image && (
                    <img 
                      src={`/${item.image}`} 
                      alt={item.title} 
                      className="cart-item-image" 
                    />
                  )}
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">
                      {item.title}
                      {item.titleKannada && (
                        <span style={{ color: '#c8102e', fontSize: '14px', display: 'block', marginTop: '4px' }}>
                          {item.titleKannada}
                        </span>
                      )}
                    </h3>
                    {item.variety && (
                      <p className="cart-item-variety">{item.variety} - {item.subVariety}</p>
                    )}
                    <p className="cart-item-price">₹{item.price}/{item.unit || 'piece'}</p>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button 
                          className="qty-btn"
                          onClick={() => changeQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => changeQty(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => remove(item.id)}
                      >
                        🗑 Remove
                      </button>
                    </div>
                    
                    <p className="cart-item-total">
                      Subtotal: <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Items:</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="cart-actions">
                <button className="clear-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="continue-btn" onClick={() => navigate("/")}>
                  Continue Shopping
                </button>
                <button className="checkout-btn" onClick={checkout}>
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
