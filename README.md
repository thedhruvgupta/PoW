# PoW (Proof of Weed)
Revolutionizing payments in the marijuana industry using Circle, Stripe, and Flow blockchain. 

# Payment Integration with Circle, Stripe, and Crypto Wallets

This project integrates Circle payments with Stripe to enable checkout using both traditional payment methods (credit/debit cards) and cryptocurrencies (via wallets like MetaMask and Phantom). It facilitates automatic conversions to USDC and ensures that the correct dispensary (dispo) wallet receives the payment.

## Features

- **Multi-Method Payments**: Users can checkout via Stripe (credit/debit) or using cryptocurrency wallets (e.g., MetaMask, Phantom).
- **Automatic USDC Conversion**: Fiat payments are converted to USDC using Circle’s API.
- **Wallet-Based Payment Routing**: Each dispensary has a unique USDC wallet, and payments are automatically routed to the respective wallet.
- **Real-Time Notifications**: Webhooks from Stripe and Circle are used to notify and handle payments in real-time.

## Prerequisites

- **API Keys**: You will need API keys from Circle and Stripe to interact with their services.
- **Crypto Wallets**: For crypto payments, wallets such as MetaMask and Phantom should be supported.
- **USDC Support**: Ensure that your Stripe account is configured to support cryptocurrency payments (specifically USDC).

## How It Works

1. **Create a Wallet for Each Dispensary**: 
   - Circle API is used to create and manage wallets for each dispensary.
   - Each wallet is identified by a unique ID.

2. **Initiate a Stripe Checkout Session**:
   - The user selects a product and starts a checkout session.
   - Stripe allows the user to pay via credit card, debit card, or cryptocurrency (USDC).
   - The dispensary’s wallet ID is included in the session metadata to ensure the payment is routed correctly.

3. **Convert Fiat to USDC** (if using traditional payment methods):
   - Once the payment is processed via Stripe, a backend process is triggered to convert the fiat currency to USDC using Circle’s API.
   - The USDC is transferred to the correct dispensary wallet.

4. **Handle Direct Crypto Payments** (e.g., MetaMask or Phantom):
   - For users paying directly in USDC via a crypto wallet, the payment is automatically routed to the respective dispensary’s wallet.

5. **Webhooks for Real-Time Updates**:
   - Stripe webhooks notify the backend when a payment is completed.
   - Circle webhooks notify the backend when USDC transfers are successfully completed.

## File Structure

- `app.py`: Flask application to handle Stripe and Circle webhooks.
- `stripe_checkout.py`: Code to create Stripe Checkout Sessions.
- `circle_api.py`: Code to handle Circle API interactions (wallet creation, fiat-to-USDC conversion).
- `README.md`: This documentation.

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/payment-integration.git
   cd payment-integration

# Complete Setup for Payment Integration with Circle, Stripe, and Crypto Wallets

1. Install Python: Ensure Python 3.6+ is installed from python.org.

2. (Optional) Create Virtual Environment:
   - `python -m venv venv`
   - `source venv/bin/activate` (Windows: `venv\Scripts\activate`)

3. Install Required Packages: 
   - `pip install requests flask stripe python-dotenv`

4. Create `.env` File in your project directory and add the following environment variables:
   - `STRIPE_SECRET_KEY=your_stripe_secret_key`
   - `CIRCLE_API_KEY=your_circle_api_key`
   - `STRIPE_ENDPOINT_SECRET=your_stripe_webhook_endpoint_secret`
   - `CIRCLE_WEBHOOK_SECRET=your_circle_webhook_secret`

5. Load Environment Variables in Your Code:
   ```python
   from dotenv import load_dotenv
   import os

   load_dotenv()
   stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
   circle_api_key = os.getenv("CIRCLE_API_KEY")

