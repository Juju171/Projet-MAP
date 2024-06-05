import React, { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Événements</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.name} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
