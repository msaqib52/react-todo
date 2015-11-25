var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var Header = require('./header');
var List = require('./list');
var rootUrl = 'https://blazing-fire-3590.firebaseio.com/';

var App = React.createClass({
  mixins: [ ReactFire ],
  getInitialState: function() {
    return {
      items: {},
      loaded: false
    };
  },
  componentWillMount: function() {
    this.fb = new Firebase(rootUrl + 'items/');
    this.bindAsObject(this.fb, 'items');
    this.fb.on('value', this.handleDataLoaded);
  },
  render: function() {
    return <div className='row panel panel-default'>
      <div className='col-md-8 col-md-offset-2'>
        <h2 className='text-center'>
          Todo List
        </h2>
        <Header itemStore={this.fb} />
        <hr />
        <div className={'content ' + (this.state.loaded ? 'loaded' : '')}>
          <List items={this.state.items} />
          {this.deleteButton()}
        </div>
      </div>
    </div>
  },
  deleteButton: function() {
    if(!this.state.loaded) {
      return null
    } else {
      return <div className='text-center clear-complete'>
        <hr />
        <button type='button' className='btn btn-default' onClick={this.onDeleteDoneClick} >
          Clear Done
        </button>
      </div>
    }
  },
  handleDataLoaded: function() {
    this.setState({ loaded: true });
  },
  onDeleteDoneClick: function() {
    for(var key in this.state.items) {
      if(this.state.items[key].done) {
        this.fb.child(key).remove();
      }
    }
  }
});

var element = React.createElement(App, {});

React.render(element, document.querySelector('.container'));
