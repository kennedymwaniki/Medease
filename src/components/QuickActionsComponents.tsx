const QuickActionsComponents = () => {
  return (
    <div className="bg-white p-4 rounded shadow-md flex flex-col w-52 gap-8 ml-4">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <button className="bg-indigo-700 text-white p-2 rounded text-sm">
        + Schedule Appointment
      </button>
      <button className="bg-green-500 text-white p-2 rounded text-sm">
        + Add new Patient
      </button>
      <button className="bg-amber-500 text-white p-2 rounded text-sm">
        + Create Prescription
      </button>
    </div>
  )
}

export default QuickActionsComponents
