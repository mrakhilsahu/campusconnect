function AdminDashboard({ events = [] }) {
  if (events.length === 0) {
    return <p className="text-gray-500">No pending events</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event._id}
          className="border rounded-lg p-4 flex justify-between items-start"
        >
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
