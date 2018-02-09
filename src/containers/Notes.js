import React, { Component } from "react";
import { invokeApig, s3Upload } from "../libs/awsLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: ""
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getNote();
      this.setState({
        note: results,
        content: results.content
      });
    } catch (e) {
      alert(e);
    }
  }


//get notes
  getNote() {
    return invokeApig({ path: `/notes/${this.props.match.params.id}` });
  }


//validate form
 validateForm() {
  return this.state.content.length > 0;
}


//format file
formatFilename(str) {
  return str.length < 50
    ? str
    : str.substr(0, 20) + "..." + str.substr(str.length - 20, str.length);
}

//handle form change
handleChange = event => {
  this.setState({
    [event.target.id]: event.target.value
  });
}


//handle file change
handleFileChange = event => {
  this.file = event.target.files[0];
}

//Save note
saveNote(note) {
  return invokeApig({
    path: `/notes/${this.props.match.params.id}`,
    method: "PUT",
    body: note
  });
}


//handle submit
//If there is a file to upload we call s3Upload to upload it and save the URL.
//We save the note by making PUT request with the note object to /notes/note_id where we get the note_id from this.props.match.params.id.
//And on success we redirect the user to the homepage.
handleSubmit = async event => {
  let uploadedFilename;

  event.preventDefault();

  if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
    alert("Please pick a file smaller than 5MB");
    return;
  }

  this.setState({ isLoading: true });

  try {
    if (this.file) {
      uploadedFilename = (await s3Upload(this.file))
        .Location;
    }

    await this.saveNote({
      ...this.state.note,
      content: this.state.content,
      attachment: uploadedFilename || this.state.note.attachment
    });
    this.props.history.push("/");
  } catch (e) {
    alert(e);
    this.setState({ isLoading: false });
  }
}

//making a DELETE request to /notes/note_id where we get the id from this.props.match.params.id. 
//This calls our delete API and we redirect to the homepage on success.
deleteNote() {
  return invokeApig({
    path: `/notes/${this.props.match.params.id}`,
    method: "DELETE"
  });
}


//handle delete

handleDelete = async event => {
  event.preventDefault();

  const confirmed = window.confirm(
    "Are you sure you want to delete this note?"
  );

  if (!confirmed) {
    return;
  }

  this.setState({ isDeleting: true });

  try {
    await this.deleteNote();
    this.props.history.push("/");
  } catch (e) {
    alert(e);
    this.setState({ isDeleting: false });
  }
}

render() {
  return (
    <div className="Notes">
      {this.state.note &&
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          {this.state.note.attachment &&
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={this.state.note.attachment}
                >
                  {this.formatFilename(this.state.note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>}
          <FormGroup controlId="file">
            {!this.state.note.attachment &&
              <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Saving…"
          />
          <LoaderButton
            block
            bsStyle="danger"
            bsSize="large"
            isLoading={this.state.isDeleting}
            onClick={this.handleDelete}
            text="Delete"
            loadingText="Deleting…"
          />
        </form>}
    </div>
  );
}
}