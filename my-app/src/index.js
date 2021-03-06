import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormControl, Col, Row, ToggleButtonGroup
  , ToggleButton, Tabs, Tab
} from 'react-bootstrap';
import './index.css';
import Axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import { FormGroup } from 'react-bootstrap';
import jaj from './pages/va.js';
import AddResult from './pages/addResult.js';
import Insert from './pages/addCandidate.js';
import {SearchCandidate,SearchResult} from './pages/search.js';
import Results from './pages/results.js';


Axios.get("http://localhost:3001/api/select").then((response) => {
  console.log(Array.isArray(response.data));
});



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCQ: '',
      searchRQ:'',
      searchR: []
    }
  }

  addSearch(e) {
    this.setState({
      searchCQ: `/search/candidate/${e.target.value}`,
      searchRQ:`/search/result/${e.target.value}`
    })
  }


  render() {
    return (

      <div>
        <Router>
          <Navbar bg="dark" variant="dark" className="justify-content-between" fixed="top">
            <Navbar.Brand href="/jaj">ELMS</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/">Candidates</Nav.Link>
              <Nav.Link href="/results">Results</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="First or Last Name or Id" className="mr-sm-2 form-control-sm" onChange={this.addSearch.bind(this)} />
              <NavLink activeClassName="active" to={this.state.searchCQ} className="btn btn-outline-info btn-sm" >Candidate</NavLink>
              <NavLink activeClassName="active" to={this.state.searchRQ} className="btn btn-outline-info btn-sm ml-1" >Result</NavLink>
              {/*  <Button variant="outline-info" component={Link} to="/insert">jaja</Button> */}
            </Form>
          </Navbar>


          <Switch>
            <Route path="/insert" component={Insert}>
            </Route>
            <Route path="/search/candidate/:name" component={SearchCandidate}>
            </Route>
            <Route path="/search/result/:name" component={SearchResult}>
            </Route>
            <Route path="/results" component={Results}></Route>
            <Route path="/addResults" component={AddResult}></Route>
            <Route path="/jaj" component={jaj}></Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>

        </Router>

      </div>

    )
  }
}

function Home() {
  return (<div className="container m-5">
    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="pt-5">
      <Tab eventKey="home" title="All">
        <Home1 />
      </Tab>
      <Tab eventKey="add" title="Add Candidate">
        <Insert />
      </Tab>
    </Tabs></div>)
};

class Home1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: []
    };
  };
  componentDidMount() {
    Axios.get("http://localhost:3001/api/select").then((response) => {
      let arr = response.data.map((el) => {
        return [el.id, el.firstname, el.lastname, el.email, el.industry, el.profilepic]
      })
      this.setState({
        candidates: [...arr]
      })
    })
  };
  deleteUser(e){
    let k = e.target.getAttribute("data-remove");
    Axios.delete(`http://localhost:3001/api/userDelete?id=${k}`).then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    });
    window.location.reload(true);
  }
  render() {
    return (<div>
      <div className="table-responsive mt-3" data-spy="scroll">
        <table className="table thead-dark table-hover table-striped table-bordered m-3 ">
          <thead className="thead-dark">
            <tr>
              <th scope="col" >User Id</th>
              <th scope="col" >First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Industry</th>
              <th scope="col">Profile pic</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

            {this.state.candidates.map((el) => {
              return (<tr>
                <td>{el[0]}</td>
                <td>{el[1]}</td>
                <td>{el[2]}</td>
                <td>{el[3]}</td>
                <td>{el[4]}</td>
                <td><img className="img-fluid"
                  src={`${process.env.PUBLIC_URL}/profilepics/${el[5]}`}
                  alt="logo" /></td>
                <td><button className="btn btn-danger btn-sm" data-remove={el[0]} type="submit"
                  onClick={this.deleteUser.bind(this)} data-toggle="tooltip" data-placement="right" title="Delete User">Del</button>
                  <button className="btn btn-secondary btn-sm mt-2" data-toggle="tooltip" data-placement="right" title="Edit User">
                    Edit</button></td>
              </tr>)
            })}

          </tbody>
        </table>

      </div>

    </div>)
  }
};











ReactDOM.render(<App />,
  document.getElementById('root')
);