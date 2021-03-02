import React from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default class DemoApp extends React.Component {
  componentDidMount() {
    localStorage.setItem('allEvents', JSON.stringify(this.state.currentEvents));
  }

  todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  state = {
    weekendsVisible: true,
    currentEvents: [
      { id: 1, title: 'Event 1', start: this.todayStr, category: 'meeting' },
      { id: 2, title: 'Event 2', start: this.todayStr, category: 'email' },
      {
        id: 2,
        title: 'Event 3',
        start: this.todayStr + 'T18:00:00',
        category: 'email',
      },
    ],
    categories: ['email', 'meeting'],
  };

  render() {
    return (
      <div className="demo-app">
        {this.renderSidebar()}
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            events={this.state.currentEvents}
          />
        </div>
      </div>
    );
  }

  renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div className="demo-app-sidebar-section">
          <label>
            <input
              type="checkbox"
              checked={this.state.weekendsVisible}
              onChange={this.handleWeekendsToggle}
            ></input>
            Toggle weekends
          </label>
        </div>
        <div className="demo-app-sidebar-section">
          <form>
            {this.state.categories.map((category, i) => {
              return (
                <label key={i}>
                  <input
                    type="checkbox"
                    onChange={this.handleCheckEvent}
                    value={category}
                  />{' '}
                  {this.functionCapitalize(category)} <br></br>
                </label>
              );
            })}
          </form>
        </div>
        <div className="demo-app-sidebar-section">
          <h2>All Events ({this.state.currentEvents.length})</h2>
          <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  }

  functionCapitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  handleCheckEvent = (event) => {
    const { currentEvents } = this.state;
    if (event.target.checked) {
      const selectedCategory = [];

      selectedCategory.push(event.target.value);

      Object.filter = (obj, predicate) =>
        Object.keys(obj)
          .filter((key) => predicate(obj[key]))
          .reduce((res, key) => ((res[key] = obj[key]), res), {});

      const eventsFiltered = Object.filter(
        currentEvents,
        (event) => event.category == selectedCategory
      );

      const selectedEvents = Object.values(eventsFiltered);
      this.setState({
        currentEvents: selectedEvents,
      });
      console.log(this.state.currentEvents);
    } else {
      const storedEvents = JSON.parse(localStorage.getItem('allEvents'));
      this.setState({
        currentEvents: storedEvents,
      });
    }
  };

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event');
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title: title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };
}

function renderEventContent(eventInfo) {
  const category = eventInfo.event._def.extendedProps.category;
  console.log(eventInfo);
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      &nbsp;
      <i>{category}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.title}>
      <b>
        {formatDate(event.start, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}
