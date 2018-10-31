import React, { Component } from 'react';

import NewTrackerForm from './components/NewTracker/NewTracker';
import TrackerData from './components/TrackerData/TrackerData';
import TrackerTable from './components/TrackerTable/TrackerTable';
import TrackForm from './components/TrackForm/TrackForm';

import './App.scss';
import * as cache from './cache';
import './icons';

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

  _createTracker = (name) => {
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
        trackers,
      });
    });
  };

  _onTrackerTableAction = (action, trackerId) => {
    switch (action) {
      case 'remove':
        return this._removeTracker(trackerId);
      case 'track':
        return this._startTracking(trackerId);
      case 'view':
        return this._viewData(trackerId);
      default:
        return null;
    }
  };

  _removeTracker = (trackerId) => {
    const currentTrackers = this.state.trackers;
    const index = currentTrackers.findIndex(({ id }) => id === trackerId);

    if (index !== -1) {
      const trackers = [
        ...currentTrackers.slice(0, index),
        ...currentTrackers.slice(index + 1),
      ];

      cache.setItem('trackers', trackers).then(() => {
        this.setState({ trackers });
      });
    }
  };

  _startTracking = (trackerId) => {
    const tracking = trackerId === this.state.tracking ?
      null :
      trackerId;

    this.setState({
      tracking,
    });
  };

  _viewData = (trackerId) => {
    const viewing = trackerId === this.state.viewing ?
      null :
      trackerId;

    this.setState({
      viewing,
    });
  };

  _track = (date, value) => {
    const data = {
      date,
      value,
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

  _renderData = () => {
    const trackerIndex = this.state.trackers.findIndex(({ id }) => id === this.state.viewing);
    const tracker = this.state.trackers[trackerIndex];
    const { data } = tracker;

    return (
      <section>
        <h2>{`Data for "${tracker.name}"`}</h2>

        <TrackerData
          data={data}
          onDelete={(index) => {
            this._deleteData(trackerIndex, index);
          }}
        />
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
  };

  render() {
    return (
      <div className="main">
        <header>
          <h1>What I Do</h1>
          <small>Data Tracking Stuff You Do</small>
        </header>

        <section>
          <NewTrackerForm onSubmit={this._createTracker} />

          <TrackerTable
            onAction={this._onTrackerTableAction}
            trackers={this.state.trackers}
          />
        </section>

        {this.state.tracking && (
          <section>
            <h2>Add Tracking Data</h2>

            <TrackForm
              onCancel={() => { this.setState({ tracking: null }); }}
              onSave={this._track}
            />
          </section>
        )}

        {this.state.viewing && this._renderData()}
      </div>
    );
  }
}

export default App;
