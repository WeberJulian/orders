import React, { Component } from 'react';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton';
import { Cached } from '@material-ui/icons';

import Network from './Network'

import './App.css';

class App extends Component {
  state = {
    selectedDate: new Date(),
    selectedPickup: "Falmooth More"
  }

  handleDateChange(date){
    this.setState({ selectedDate: date });
  }

  handlePickupChange(pickup){
    this.setState({ selectedPickup: pickup.target.value });
  }

  handleRefresh(){
    Network.getOrders(null, this.updateStatus.bind(this), this.updateOrders.bind(this))
  }

  updateStatus(status){
    this.setState({ status });
  }

  updateOrders(orders){
    this.setState({ orders });
    console.log(orders)
  }

  componentDidMount(){
    Network.getOrders(null, this.updateStatus.bind(this), this.updateOrders.bind(this))
  }

  render() {
    const { selectedDate } = this.state;
    return (
      <div className="Main-container">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Typography variant="h1" align="center" className="Title">Nakiwi orders</Typography>
      <Paper className="Paper-container">
        <Grid container>
          <Grid item xs align="center">
            <InputLabel htmlFor="age-simple">Date : </InputLabel>
            <DatePicker value={selectedDate} onChange={this.handleDateChange.bind(this)} />
          </Grid>
          <Grid item xs align="center">
            <InputLabel htmlFor="age-simple">Pickup point : </InputLabel>
            <Select
              value={this.state.selectedPickup}
              onChange={this.handlePickupChange.bind(this)}
              className={"Picker"}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Falmooth More"}>Falmooth More</MenuItem>
              <MenuItem value={"Penryn Campus"}>Penryn Campus</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <IconButton onClick={this.handleRefresh.bind(this)}>
              <Cached/>
            </IconButton>
          </Grid>
        </Grid>
        </Paper>
      </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default App;
