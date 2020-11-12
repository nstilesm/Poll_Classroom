import React from "react";
import { Link } from "react-router-dom";

import Button from "../buttons/button";

class ShowQuestion extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props.question);
    this.state = { closed: "", text_answers: {}, question_choices: {} };

    // this.state = { status: this.props.question };
    this.activated = this.activated.bind(this);
    this.renderQuestionOptions = this.renderQuestionOptions.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    let that = this;
    this.subscription = window.App.cable.subscriptions.create(
      { channel: "ResponseChannel", groupId: this.props.question.group_id },
      {
        received: (broadcast) => {
          // console.log(JSON.parse(broadcast.data));

          if (this.props.question.kind === "text_response") {
            const text_answers = this.state.text_answers;
            text_answers[this.props.question.id] = JSON.parse(
              broadcast.data
            ).body;
            that.setState({ text_answers });
          } else {
            const question_choices = this.state.question_choices;
            question_choices[this.props.question.id] = JSON.parse(
              broadcast.data
            ).question_options_id;
            that.setState({ question_choices });
          }

          // let question_option_choice = JSON.parse(broadcast.data)
          //   .question_options_id;
          // let question_choice = JSON.parse(broadcast.data).question_id;

          // {id: 4, body: null, question_options_id: 29, question_id: 44}
          // {id: 93, body: "asd", question_options_id: null, question_id: 3}
        },
      }
    );
  }

  update() {
    this.setState({ status: !this.state.status });
  }

  renderQuestionOptions(question) {
    if (question.kind === "mult_response") {
      return question.question_options.map((question_option) => (
        <div className="options-show-page">{question_option.label}</div>
      ));
    }
  }

  toggleActive() {
    // console.log(this.state);
    // console.log(this.props.question);

    this.props.question.closed = !this.props.question.closed;
    this.props.updateQuestion(this.props.question).then(() => {
      this.setState({ closed: !this.props.question.closed });
    });
  }

  renderQuestion() {
    let number = this.props.question.id;
    let data;
    // console.log(this.props.question);
    Object.keys(this.state.text_answers).forEach(function (object_id) {
      if (number === object_id) {
        console.log("hi");
        data = this.state.text_answers[object_id];
      }
    });
    console.log(data);
    let question = this.props.question;
    return (
      <div className="poll-question">
        {this.renderQuestionOptions(question)}
        {data}
      </div>
    );
  }

  activated(e) {
    if (
      (this.props.question != undefined && this.props.question.closed) == true
    ) {
      return (
        <Button whiteGrey={true} oneThird={true} onClick={this.toggleActive}>
          Activate
        </Button>
      );
    } else {
      return (
        <Button whiteGrey={true} oneThird={true} onClick={this.toggleActive}>
          Deactivate
        </Button>
      );
    }
  }
  render() {
    let number = this.props.question.id;

    return (
      <div className="show-page">
        {/* <h1>Title</h1>
                <h1>{this.props.question.title}</h1>
                <h3>{this.props.question.kind}</h3>
                <p>{this.props.question.closed}</p>
                <p>{this.props.question.allow_unregistered}</p>
                <p>{this.props.question.response_limit}</p> */}
        <div className="white-small-box">
          <div className="edit-box">
            <div className="top-grey">Respond at</div>
            <div className="white-show-box">
              <div className="show-page-title">{this.props.question.title}</div>
              <div>{this.renderQuestion()}</div>
              <div>{data}</div>
            </div>
            <div className="bottom-logo"></div>
          </div>
        </div>

        {/* <Link to="/">Link</Link> */}
        <div className="white-box">
          <div className="button-box">
            <Button
              blue={true}
              oneThird={true}
              to={`/questions/${number}/edit`}
            >
              Edit
            </Button>
            {this.activated()}
            <Button whiteGrey={true} oneThird={true} to="/questions/">
              Back
            </Button>
          </div>
        </div>
      </div>
    );
    // if (!isNaN(number)) {
    //     // debugger
    //     console.log(number);
    // } else {
    //     console.log("nowork");
    // }
    // debugger
  }
}

export default ShowQuestion;
