import React from 'react'
import Title from './Title'
import { pricingPlans } from '../constant/data'

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
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
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 ${
                plan.popular ? 'border-2 border-orange-50 relative' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-50 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  {plan.period && <span className="text-gray-600">/{plan.period}</span>}
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full mr-3 flex items-center justify-center text-xs">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.popular 
                    ? 'bg-orange-50 text-white hover:bg-orange-600' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing