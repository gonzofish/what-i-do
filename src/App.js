import React, { Component } from 'react';
import './App.scss';

import * as cache from './cache';

const formatDateTime = (date) => (
  `${formatDate(date)} ${formatTime(date)}`
);
const formatDate = (date) => (
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`
);
const formatTime = (date) => (
  `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`
);
const padNumber = (value, length = 2) => padLeft(value, '0', length);
const padLeft = (value, pad, length) => {
  let padded = `${value}`;

  while (padded.length < length) {
    padded = `${pad}${padded}`;
  }

  return padded;
}

class App extends Component {
  state = {
    newTracker: '',
    trackers: [],
    tracking: null,
    viewing: null,
  };

  componentDidMount() {
    cache.getItem('trackers').then((trackers) => {
      this.setState({
        trackers: trackers || []
      });
    })
  }

  _createTracker = (event) => {
    event.preventDefault();

    const name = this.state.newTracker;
    const id = name.replace(/\s+/g, '-');
    const trackers = this.state.trackers.concat({
      data: [],
      id,
      name,
    }).sort((tracker1, tracker2) => {
      const name1 = tracker1.name.toLowerCase();
      const name2 = tracker2.name.toLowerCase();
      let sort = 0;

      if (name1 < name2) {
        sort = -1;
      } else if (name1 > name2) {
        sort = 1;
      }

      return sort;
    });

    cache.setItem('trackers', trackers).then(() => {
      this.setState({
        newTracker: '',
        trackers,
      });
    });
  };

  _removeTracker = (index) => {
    const currentTrackers = this.state.trackers;
    const trackers = [
      ...currentTrackers.slice(0, index),
      ...currentTrackers.slice(index + 1),
    ];

    cache.setItem('trackers', trackers).then(() => {
      this.setState({ trackers });
    });
  };

  _startTracking = (trackerId) => {
    const tracking = trackerId === this.state.tracking ?
      null :
      trackerId;

    this.setState({
      tracking,
    });
  };

  _track = (event) => {
    event.preventDefault();

    const { elements } = event.target;
    const dateString = `${elements.trackDate.value}  ${elements.trackTime.value}`;
    const data = {
      date: new Date(dateString),
      value: elements.trackValue.value,
    };
    const currentTrackers = this.state.trackers;
    const index = currentTrackers.findIndex(({ id }) => id === this.state.tracking);
    const tracker = currentTrackers[index];
    const trackers = [
      ...currentTrackers.slice(0, index),
      {
        ...tracker,
        data: tracker.data.concat(data),
      },
      ...currentTrackers.slice(index + 1),
    ];

    cache.setItem('trackers', trackers).then(() => {
      this.setState({
        trackers,
        tracking: null,
      });
    });

  }

  _viewData = (trackerId) => {
    const viewing = trackerId === this.state.viewing ?
      null :
      trackerId;

    this.setState({
      viewing,
    });
  };

  _renderData = () => {
    const trackerIndex = this.state.trackers.findIndex(({ id }) => id === this.state.viewing);
    const tracker = this.state.trackers[trackerIndex];
    const { data } = tracker;

    return (
      <section>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Value</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <tbody>
            {data.map((point, index) => (
              <tr key={point.date.valueOf()}>
                <td>{formatDateTime(point.date)}</td>
                <td>{point.value}</td>
                <th>
                  <button
                    onClick={() => this._deleteData(trackerIndex, index)}
                    title="Delete data point"
                    type="button"
                  >
                    <span
                      aria-label="Delete data point icon"
                      role="img"
                    >
                      🗑
                    </span>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  _deleteData = (trackerIndex, index) => {
    const { trackers } = this.state;
    const tracker = trackers[trackerIndex];
    const newTrackers = [
      ...trackers.slice(0, trackerIndex),
      {
        ...tracker,
        data: [
          ...tracker.data.slice(0, index),
          ...tracker.data.slice(index + 1),
        ]
      },
      ...trackers.slice(trackerIndex + 1),

    ];

    cache.setItem('trackers', newTrackers).then(() => {
      this.setState({
        trackers: newTrackers,
      });
    });
  }

  render() {
    const now = new Date();
    const defaultDate = formatDate(now);
    const defaultTime = formatTime(now);

    return (
      <div className="main">
        <header>
          <h1>What I Do</h1>
          <small>Data Tracking Stuff You Do</small>
        </header>

        <section>
          <form
            className="input-group"
            onSubmit={this._createTracker}
          >
            <input
              onChange={({ target }) => {
                this.setState({ newTracker: target.value });
              }}
              type="text"
              value={this.state.newTracker}
            />
            <button
              title="Add Tracker"
              type="submit"
            >
              <span role="img" aria-label="Add Tracker Icon">➕</span>
            </button>
          </form>

          <table>
            <thead>
              <tr>
                <th>Tracker</th>
                <th>Data Points</th>
                <th>&nbsp;</th>
              </tr>
            </thead>

            <tbody>
              {this.state.trackers.map((tracker, index) => (
                <tr key={tracker.id}>
                  <td>{tracker.name}</td>
                  <td>{tracker.data.length}</td>
                  <td>
                    <button
                      onClick={() => { this._startTracking(tracker.id); }}
                      title={`Track "${tracker.name}"`}
                      type="button"
                    >
                      <span
                        role="img"
                        aria-label="Track Icon"
                      >
                        📝
                      </span>
                    </button>

                    <button
                      onClick={() => { this._viewData(tracker.id); }}
                      title={`View "${tracker.name}" Data`}
                      type="button"
                    >
                      <span
                        role="img"
                        aria-label="View Data icon"
                      >
                        🔍
                      </span>
                    </button>

                    <button
                      onClick={() => { this._removeTracker(index); }}
                      title={`Remove "${tracker.name}"`}
                      type="button"
                    >
                      <span role="img" aria-label="Remove Tracker Icon">🗑</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {this.state.tracking && (
          <section>
            <h2>Add Tracking Data</h2>

            <form onSubmit={this._track}>
              <label htmlFor="trackDate">
                Date:
                <input
                  defaultValue={defaultDate}
                  id="trackDate"
                  name="trackDate"
                  type="date"
                />
              </label>

              <label htmlFor="trackTime">
                Time:
                <input
                  defaultValue={defaultTime}
                  id="trackTime"
                  name="trackTime"
                  type="time"
                />
              </label>

              <label htmlFor="trackValue">
                Units:
                <input
                  defaultValue={0}
                  id="trackValue"
                  name="trackValue"
                  type="number"
                />
              </label>

              <button
                title="Save Tracking Data"
                type="submit"
              >
                <span role="img" aria-label="Save Tracking Data Icon">
                  💾
                </span>
              </button>

              <button
                onClick={() => { this._startTracking(null); }}
                title="Cancel Tracking Data"
                type="button"
              >
                <span role="img" aria-label="Cancel Tracking Data Icon">
                  🚫
                </span>
              </button>
            </form>
          </section>
        )}

        {this.state.viewing && this._renderData()}
      </div>
    );
  }
}

export default App;
