import React from 'react'

const Title = ({ title, text, link, onClick }) => {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="max-w-[640px] mx-auto mt-4 mb-6 text-grey-15">
        {text}
      </p>
      <button onClick={onClick} className="secondary-btn mx-auto">
        {link}
      </button>
    </div>
  )
}

export default Title
