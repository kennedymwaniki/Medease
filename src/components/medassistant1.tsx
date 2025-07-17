// import { useEffect, useRef, useState } from 'react'
// import { motion } from 'framer-motion'
// import ModelClient from '@azure-rest/ai-inference'
// import { AzureKeyCredential } from '@azure/core-auth'
// import { createSseStream } from '@azure/core-sse'
// import {
//   AlertCircle,
//   Bot,
//   Calendar,
//   FileText,
//   FlaskConical,
//   Heart,
//   Phone,
//   Pill,
//   Presentation,
//   Send,
//   Users,
// } from 'lucide-react'

// const API_KEY = import.meta.env.API_KEY!

// interface Message {
//   id: string
//   role: 'user' | 'assistant' | 'system'
//   content: string
//   timestamp: Date
// }

// interface AppointmentOption {
//   doctor: string
//   department: string
//   experience: string
//   times: Array<string>
// }

// const quickActions = [
//   {
//     icon: Calendar,
//     label: 'Book an Appointment',
//     color: 'bg-blue-600',
//     action: 'book_appointment',
//   },
//   // {
//   //   icon: Presentation,
//   //   label: 'Create PowerPoint',
//   //   color: 'bg-purple-600',
//   //   action: 'create_powerpoint',
//   // },
//   {
//     icon: FileText,
//     label: 'Payment & Billing Help',
//     color: 'bg-green-600',
//     action: 'billing_help',
//   },
//   {
//     icon: Users,
//     label: 'Update Medical History',
//     color: 'bg-orange-600',
//     action: 'update_history',
//   },
//   // {
//   //   icon: FlaskConical,
//   //   label: 'Find Available Devices',
//   //   color: 'bg-teal-600',
//   //   action: 'find_devices',
//   // },
//   {
//     icon: Pill,
//     label: 'Check Prescription Status',
//     color: 'bg-indigo-600',
//     action: 'check_prescription',
//   },
//   {
//     icon: Heart,
//     label: 'Health Questions',
//     color: 'bg-pink-600',
//     action: 'health_questions',
//   },
//   {
//     icon: Phone,
//     label: 'Emergency Contacts',
//     color: 'bg-red-600',
//     action: 'emergency',
//   },
// ]

// const doctorSlots = [
//   { time: '9:00 AM', available: true },
//   { time: '11:50 AM', available: true },
//   { time: '2:00 PM', available: false },
//   { time: '4:59 PM', available: true },
//   { time: '5:00 PM', available: true },
//   { time: '6:30 PM', available: false },
// ]

// const MedEaseAssistant = () => {
//   const [messages, setMessages] = useState<Array<Message>>([
//     {
//       id: '1',
//       role: 'assistant',
//       content:
//         "Hello! I'm your MedEase AI Assistant. I can help you with appointments, presentations, billing, and answer health-related questions. How can I assist you today?",
//       timestamp: new Date(),
//     },
//   ])
//   const [inputMessage, setInputMessage] = useState('')
//   const [isOnline, setIsOnline] = useState(true)
//   const [showAppointmentOptions, setShowAppointmentOptions] = useState(false)
//   const [selectedDepartment, setSelectedDepartment] =
//     useState('General Practice')
//   const [preferredDate, setPreferredDate] = useState('')
//   const [appointmentOptions, setAppointmentOptions] = useState<
//     Array<AppointmentOption>
//   >([])
//   const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   // Mock appointment data
//   useEffect(() => {
//     setAppointmentOptions([
//       {
//         doctor: 'Dr. Michael Smith',
//         department: 'Oncology',
//         experience: '15 years exp',
//         times: ['9:00 AM', '11:50 AM', '5:00 PM', '4:59 PM'],
//       },
//     ])
//   }, [])

//   // Scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim() || isLoading) return

//     // Add user message to chat
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: inputMessage,
//       timestamp: new Date(),
//     }
//     setMessages((prev) => [...prev, userMessage])
//     const currentInput = inputMessage
//     setInputMessage('')
//     setIsLoading(true)

//     // Check for appointment keyword
//     if (currentInput.toLowerCase().includes('appointment')) {
//       setShowAppointmentOptions(true)
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: (Date.now() + 1).toString(),
//           role: 'assistant',
//           content: "I'll help you book an appointment. Here's how:",
//           timestamp: new Date(),
//         },
//       ])
//       setIsLoading(false)
//       return
//     }

//     try {
//       // Call Azure AI model
//       const client = ModelClient(
//         'https://kennedy-foundry-resource.services.ai.azure.com/models',
//         new AzureKeyCredential(
//           '4CmPxVbbr7fOagay6WwQzNEUsSqz4CZAQ9Xh7bUljwY19SsgMoaJJQQJ99BFACYeBjFXJ3w3AAAAACOG9cAz',
//         ),
//       )

//       const response = await client
//         .path('/chat/completions')
//         .post({
//           body: {
//             messages: [
//               {
//                 role: 'system',
//                 content:
//                   'You are a helpful medical assistant named Heidi from MedEase. Help with appointments or medical questions, billing, and other healthcare needs.',
//               },
//               ...messages.map((msg) => ({
//                 role: msg.role,
//                 content: msg.content,
//               })),
//               { role: 'user', content: currentInput },
//             ],
//             max_tokens: 2048,
//             temperature: 0.8,
//             top_p: 0.1,
//             presence_penalty: 0,
//             frequency_penalty: 0,
//             model: 'DeepSeek-V3-0324',
//             stream: true,
//           },
//         })
//         .asBrowserStream()

//       const stream = response.body
//       if (!stream) {
//         throw new Error('The response stream is undefined')
//       }

//       if (response.status !== '200') {
//         await stream.cancel()
//         throw new Error(
//           `Failed to get chat completions, http operation failed with ${response.status} code`,
//         )
//       }

//       const sseStream = createSseStream(stream)
//       let assistantResponse = ''
//       const assistantMessageId = (Date.now() + 1).toString()

//       // Add initial assistant message
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: assistantMessageId,
//           role: 'assistant',
//           content: '',
//           timestamp: new Date(),
//         },
//       ])

//       for await (const event of sseStream) {
//         if (event.data === '[DONE]') {
//           break
//         }
//         for (const choice of JSON.parse(event.data).choices) {
//           const chunk = choice.delta?.content ?? ''
//           assistantResponse += chunk
//           // Update the assistant message with streaming response
//           setMessages((prev) => {
//             const newMessages = [...prev]
//             const lastMessage = newMessages[newMessages.length - 1]
//             if (lastMessage.id === assistantMessageId) {
//               lastMessage.content = assistantResponse
//             }
//             return newMessages
//           })
//         }
//       }
//     } catch (error) {
//       console.error('Error calling AI model:', error)
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: (Date.now() + 1).toString(),
//           role: 'assistant',
//           content:
//             "Sorry, I'm having trouble connecting to the service. Please try again later.",
//           timestamp: new Date(),
//         },
//       ])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleQuickAction = (action: string) => {
//     if (action === 'book_appointment') {
//       setShowAppointmentOptions(true)
//       const appointmentMessage: Message = {
//         id: Date.now().toString(),
//         role: 'assistant',
//         content: "I'll help you book an appointment! Here's how:",
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, appointmentMessage])
//     } else {
//       const userMessage: Message = {
//         id: Date.now().toString(),
//         role: 'user',
//         content: `Help me with ${action.replace('_', ' ')}`,
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, userMessage])

//       // Simulate AI response for other actions
//       setTimeout(() => {
//         const aiResponse: Message = {
//           id: (Date.now() + 1).toString(),
//           role: 'assistant',
//           content: `I'll help you with ${action.replace('_', ' ')}. Please provide more details about what you need.`,
//           timestamp: new Date(),
//         }
//         setMessages((prev) => [...prev, aiResponse])
//       }, 1000)
//     }
//   }

//   const handleCheckAvailability = () => {
//     const bookingMessage: Message = {
//       id: Date.now().toString(),
//       role: 'assistant',
//       content:
//         'Dr. Smith has availability tomorrow. Here are the available slots:',
//       timestamp: new Date(),
//     }
//     setMessages((prev) => [...prev, bookingMessage])
//     setSelectedDoctor('Dr. Michael Smith')
//   }

//   const handleBookAppointment = (time: string, doctor: string) => {
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: `Book appointment with ${doctor} at ${time}`,
//       timestamp: new Date(),
//     }

//     const assistantMessage: Message = {
//       id: (Date.now() + 1).toString(),
//       role: 'assistant',
//       content: `Your appointment with ${doctor} at ${time} has been booked successfully!`,
//       timestamp: new Date(),
//     }

//     setMessages((prev) => [...prev, userMessage, assistantMessage])
//     setShowAppointmentOptions(false)
//     setSelectedDoctor(null)
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="bg-white border-b border-gray-200 p-4 shadow-sm"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//               <Bot className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="font-semibold text-lg text-gray-900">
//                 MedEase AI Assistant
//               </h1>
//               <div className="flex items-center gap-2">
//                 <div
//                   className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
//                 />
//                 <span className="text-sm text-gray-600">
//                   {isOnline ? 'Online' : 'Offline'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.map((message, index) => (
//             <motion.div
//               key={message.id}
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: index * 0.1 }}
//               className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`max-w-[80%] ${
//                   message.role === 'user'
//                     ? 'bg-blue-500 text-white rounded-br-none'
//                     : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
//                 } rounded-2xl p-4`}
//               >
//                 <p className="text-sm leading-relaxed">{message.content}</p>
//                 <p className="text-xs mt-2 opacity-70">
//                   {message.timestamp.toLocaleTimeString([], {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </p>
//               </div>
//             </motion.div>
//           ))}

//           {/* Loading indicator */}
//           {isLoading && (
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="flex justify-start"
//             >
//               <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-200">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: '0.1s' }}
//                   />
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: '0.2s' }}
//                   />
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Appointment Booking Flow */}
//           {showAppointmentOptions && (
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-200 max-w-[80%]"
//             >
//               <h3 className="font-medium mb-4 text-gray-900">
//                 Quick Appointment Booking
//               </h3>
//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">
//                     Select Department
//                   </label>
//                   <select
//                     className="w-full p-2 border border-gray-300 rounded-lg bg-white"
//                     value={selectedDepartment}
//                     onChange={(e) => setSelectedDepartment(e.target.value)}
//                   >
//                     <option>General Practice</option>
//                     <option>Oncology</option>
//                     <option>Cardiology</option>
//                     <option>Pediatrics</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">
//                     Preferred Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full p-2 border border-gray-300 rounded-lg bg-white"
//                     value={preferredDate}
//                     onChange={(e) => setPreferredDate(e.target.value)}
//                   />
//                 </div>
//                 <button
//                   onClick={handleCheckAvailability}
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Check Availability
//                 </button>
//               </div>
//             </motion.div>
//           )}

//           {/* Doctor Availability */}
//           {selectedDoctor && (
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-200 max-w-[80%]"
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                   MS
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">
//                     {selectedDoctor}
//                   </h4>
//                   <p className="text-sm text-gray-600">
//                     Oncology • 15 years exp
//                   </p>
//                   <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                     Available
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-2">
//                 {doctorSlots.map((slot) => (
//                   <button
//                     key={slot.time}
//                     disabled={!slot.available}
//                     onClick={() =>
//                       slot.available &&
//                       handleBookAppointment(slot.time, selectedDoctor)
//                     }
//                     className={`text-sm py-2 px-3 rounded-lg border transition-colors ${
//                       slot.available
//                         ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
//                         : 'border-gray-300 text-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     {slot.time}
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="p-4 border-t border-gray-200 bg-white">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Ask me about your health, appointments, or medical services..."
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isLoading}
//               className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions Sidebar */}
//       <motion.div
//         initial={{ x: 20, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto"
//       >
//         <h2 className="font-semibold text-lg mb-4 text-gray-900">
//           Quick Actions
//         </h2>
//         <div className="space-y-3">
//           {quickActions.map((action, index) => (
//             <motion.div
//               key={action.action}
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: index * 0.05 }}
//             >
//               <div
//                 className="cursor-pointer hover:shadow-md transition-all duration-200 group bg-white border border-gray-200 rounded-lg p-4"
//                 onClick={() => handleQuickAction(action.action)}
//               >
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
//                   >
//                     <action.icon className="w-5 h-5 text-white" />
//                   </div>
//                   <span className="font-medium text-sm text-gray-900">
//                     {action.label}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Emergency Contact */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//             <span className="font-medium text-red-900">Emergency Contact</span>
//           </div>
//           <button
//             className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
//             onClick={() => window.open('tel:911')}
//           >
//             <Phone className="w-4 h-4" />
//             Call Emergency
//           </button>
//         </motion.div>

//         {/* Connection Status */}
//         <div className="mt-6 text-center">
//           <p className="text-xs text-gray-500">Connection Status</p>
//           <div className="flex items-center justify-center gap-2 mt-1">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//             <span className="text-sm text-green-600">Secure</span>
//           </div>
//           <p className="text-xs text-gray-500 mt-1">HIPAA Compliant</p>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default MedEaseAssistant
