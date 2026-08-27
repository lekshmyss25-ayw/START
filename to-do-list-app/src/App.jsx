
/*
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";

class App extends Component {
    constructor(props) {
        super(props);

        // Setting up state
        this.state = {
            userInput: "",
            list: [],
        };
    }

    // Set a user input value
    updateInput(value) {
        this.setState({
            userInput: value,
        });
    }
   

    // Add item if user input in not empty
    addItem() {
        if (this.state.userInput !== "") {
            const userInput = {
                // Add a random id which is used to delete
                id: Math.random(),

                // Add a user value to list
                value: this.state.userInput,
            };

            // Update list
            const list = [...this.state.list];
            list.push(userInput);

            // reset state
            this.setState({
                list,
                userInput: "",
            });
        }
    }

    // Function to delete item from list use id to delete
    deleteItem(key) {
        const list = [...this.state.list];

        // Filter values and leave value which we need to delete
        const updateList = list.filter((item) => item.id !== key);

        // Update list in state
        this.setState({
            list: updateList,
        });
    }

    editItem = (index) => {
      const todos = [...this.state.list];
      const editedTodo = prompt('Edit the todo:');
      if (editedTodo !== null && editedTodo.trim() !== '') {
        let updatedTodos = [...todos]
        updatedTodos[index].value= editedTodo
        this.setState({
          list: updatedTodos,
      });
      }
    }

    render() {
        return (

            
            <Container>
                <header className="text-center mt-4">
                <h1 style={{ fontWeight: "bold" }}>Done&OUT.</h1>
            </header>
            <hr />
                 <Row className="text-center mt-3">
                    <Col md={{ span: 5, offset: 4 }}>
                        <input 
                            type="button" 
                            className="btn btn-primary opt" 
                            id="yn" 
                            value="+" 
                            onClick={() => this.addItem()} 
                        />
                    </Col>
                </Row>
                // Place this inside the render() block of your App.jsx component


                <Row
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "3rem",
                        fontWeight: "bolder",
                    }}
                >
                    TODO LIST
                </Row>

                <hr />
                <Row>
                    <Col md={{ span: 5, offset: 4 }}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="add item . . . "
                                size="lg"
                                value={this.state.userInput}
                                onChange={(item) =>
                                    this.updateInput(item.target.value)
                                }
                                aria-label="add something"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup>
                                <Button
                                    variant="dark"
                                    className="mt-2"
                                    onClick={() => this.addItem()}
                                >
                                    ADD
                                </Button>
                            </InputGroup>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 5, offset: 4 }}>
                        <ListGroup>
                            {/* map over and print items *
                            {this.state.list.map((item, index) => {
                                return (
                                  <div key = {index} > 
                                    <ListGroup.Item
                                        variant="dark"
                                        action
                                        style={{display:"flex",
                                                justifyContent:'space-between'
                                      }}
                                    >
                                        {item.value}
                                        <span>
                                        <Button style={{marginRight:"10px"}}
                                        variant = "light"
                                        onClick={() => this.deleteItem(item.id)}>
                                          Delete
                                        </Button>
                                        <Button variant = "light"
                                        onClick={() => this.editItem(index)}>
                                          Edit
                                        </Button>
                                        </span>
                                    </ListGroup.Item>
                                  </div>
                                );
                            })}
            //            </ListGroup>
          //          </Col>
        //        </Row>
      //      </Container>
    //    );
  //  }
//}

//export default App;
*/


import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";

class App extends Component {
    constructor(props) {
        super(props);

        // Setting up state
        this.state = {
            userInput: "",
            list: [],
        };
    }

    // Set a user input value
    updateInput(value) {
        this.setState({
            userInput: value,
        });
    }

    // Add item if user input is not empty
    addItem() {
        if (this.state.userInput !== "") {
            const userInput = {
                // Add a random id which is used to delete
                id: Math.random(),

                // Add a user value to list
                value: this.state.userInput,
            };

            // Update list
            const list = [...this.state.list];
            list.push(userInput);

            // reset state
            this.setState({
                list,
                userInput: "",
            });
        }
    }

    // Function to delete item from list use id to delete
    deleteItem(key) {
        const list = [...this.state.list];

        // Filter values and leave value which we need to delete
        const updateList = list.filter((item) => item.id !== key);

        // Update list in state
        this.setState({
            list: updateList,
        });
    }

    editItem = (index) => {
        const todos = [...this.state.list];
        const editedTodo = prompt('Edit the todo:');
        if (editedTodo !== null && editedTodo.trim() !== '') {
            let updatedTodos = [...todos]
            updatedTodos[index].value = editedTodo
            this.setState({
                list: updatedTodos,
            });
        }
    }

    render() {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h1 className="text-center mb-4 fw-bold">React To-Do List</h1>
                        
                        {/* Input elements */}
                        <InputGroup className="mb-4 shadow-sm">
                            <FormControl
                                placeholder="Add a new task..."
                                aria-label="Add task"
                                value={this.state.userInput}
                                onChange={(e) => this.updateInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && this.addItem()}
                            />
                            <Button 
                                variant="primary" 
                                onClick={() => this.addItem()}
                            >
                                Add Task
                            </Button>
                        </InputGroup>

                        {/* Task List elements */}
                        <ListGroup variant="flush" className="shadow-sm rounded">
                            {this.state.list.map((item, index) => (
                                <ListGroup.Item 
                                    key={item.id} 
                                    className="d-flex justify-content-between align-items-center py-3"
                                >
                                    <span className="text-break">{item.value}</span>
                                    <div>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => this.editItem(index)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => this.deleteItem(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        {/* Empty state handler */}
                        {this.state.list.length === 0 && (
                            <p className="text-center text-muted mt-3 fs-5">
                                No tasks remaining. Add something above!
                            </p>
                        )}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
