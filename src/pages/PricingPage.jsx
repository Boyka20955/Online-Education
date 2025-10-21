import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { pricingPlans } from '../constant/data'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const PricingPage = ({ containerRef }) => {
  // Check if rendered in dashboard (dark background)
  const isInDashboard = containerRef ? true : false;

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    if (isInDashboard) {
      fetchPricing();
    }
  }, [isInDashboard]);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pricing');
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const currentPricing = isInDashboard ? pricing : pricingPlans;

  const handleEnrollNow = (plan) => {
    if (!user) {
      toast.error('Please login to enroll in courses')
      return
    }
    setSelectedPlan(plan)
    setAmount(plan.price.toString())
    setShowPaymentModal(true)
  }

const handlePayment = async () => {
  if (!phoneNumber || !amount) {
    toast.error('Please fill in all fields')
    return
  }

  setIsProcessing(true)
  try {
    const response = await fetch('http://localhost:5000/api/stkpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This will include the auth token
      body: JSON.stringify({
        phone: phoneNumber,
        accountNumber: selectedPlan.id.toString(),
        amount: parseInt(amount)
      })
    })

    const data = await response.json()

    if (data.status) {
      toast.success(data.msg)
      setShowPaymentModal(false)
      // Purchase record is now automatically created in the STK push endpoint
      // No need to make additional API call
    } else {
      toast.error(data.msg)
    }
  } catch (error) {
    console.error('Payment error:', error)
    toast.error('Payment failed. Please try again.')
  } finally {
    setIsProcessing(false)
  }
}

  return (
    <section id="pricing" className={`py-16 ${isInDashboard ? 'bg-amber-100 text-blue-500' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-5">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <Title
            title="Pricing Plans"
            text="Choose the plan that works best for you. All plans include access to our core features with flexible options for every learner."
            link="Compare Plans"
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 mt-12">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">Loading pricing plans...</p>
            </div>
          ) : (
            currentPricing.map((plan) => (
              <div
                key={plan.id}
                className={`${isInDashboard ? 'bg-amber-600 border-amber-600' : 'bg-white'} rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 ${
                  plan.popular ? 'border-2 border-orange-50 relative' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-50 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${isInDashboard ? 'text-white' : ''}`}>{plan.name}</h3>
                  <div className="mb-4">
                    <span className={`text-3xl font-bold ${isInDashboard ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                    {plan.period && <span className={`${isInDashboard ? 'text-gray-300' : 'text-gray-600'}`}>/{plan.period}</span>}
                  </div>
                  <p className={`${isInDashboard ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{plan.description}</p>
                </div>

                <button
                  onClick={() => handleEnrollNow(plan)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-orange-50 text-white hover:bg-orange-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Enroll in Course</h3>
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={() => setShowPaymentModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <p className="text-lg font-semibold text-gray-900">{selectedPlan.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="254XXXXXXXXX"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Send Payment Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default PricingPage
