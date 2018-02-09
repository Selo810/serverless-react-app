import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { invokeApig } from '../libs/awsLib';
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }
  
  //make a GET request to /notes on componentDidMount and puts the results in the notes object in the state.
  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const results = await this.notes();
      this.setState({ notes: results });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  notes() {
    return invokeApig({ path: "/notes" });
  }


//It always renders a Create a new note button as the first item in the list (even if the list is empty). 
//We do this by concatenating an array with an empty object with our notes array.
//We render the first line of each note as the ListGroupItem header by doing note.content.trim().split('\n')[0].
//And onClick for each of the list items we navigate to their respective pages.
  renderNotesList(notes) {
      return [{}].concat(notes).map(
        (note, i) =>
          i !== 0
            ? <ListGroupItem
                key={note.noteId}
                href={`/notes/${note.noteId}`}
                onClick={this.handleNoteClick}
                header={note.content.trim().split("\n")[0]}
              >
                {"Created: " + new Date(note.createdAt).toLocaleString()}
              </ListGroupItem>
            : <ListGroupItem
                key="new"
                href="/notes/new"
                onClick={this.handleNoteClick}
              >
                <h4>
                  <b>{"\uFF0B"}</b> Create a new note
                </h4>
              </ListGroupItem>
      );
    }

handleNoteClick = event => {
  event.preventDefault();
  this.props.history.push(event.currentTarget.getAttribute("href"));
}

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}