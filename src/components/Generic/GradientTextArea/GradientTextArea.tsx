import React from 'react'

interface TextAreaProps {
  heading: string
  text: string
}

const GradientTextArea: React.FC<TextAreaProps> = ({ heading, text }) => {
  return (
    <div className="relative w-full h-full min-h-[200px]">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-5/4 h-3/5 bg-muted-blue rounded-full blur-[80px]" />
      </div>
      <div className="absolute inset-0 flex justify-center items-center p-13">
        <div className="relative z-10 flex flex-col justify-center -mt-8">
          <h1 className="text-dark-blue font-dm-serif-display font-normal text-2xl md:text-3xl lg:text-4xl italic mx-auto my-6 max-w-2xl">
            {heading}
          </h1>
          <p className="text-dark-blue whitespace-pre-line italic text-sm sm:text-base md:text-lg lg:text-xl pt-3 pl-3">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GradientTextArea
