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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import Network from './Network'

import './App.css';

const dateFns = new DateFnsUtils();

class App extends Component {
  state = {
    selectedDate: new Date(),
    selectedPickup: "Falmooth More",
    loading: false,
    orders: null,
    order: null,
    modal: false
  }

  handleDateChange(date) {
    this.setState({ selectedDate: date });
    this.setState({ loading : true })
    Network.getOrders(dateFns.format(date, 'D+MMMM'), this.updateStatus.bind(this), this.updateOrders.bind(this))
  }

  handlePickupChange(pickup) {
    this.setState({ selectedPickup: pickup.target.value });
    this.setState({ loading : true })
    Network.getOrders(dateFns.format(this.state.selectedDate, 'd+MMMM'), this.updateStatus.bind(this), this.updateOrders.bind(this))
  }

  handleRefresh() {
    this.setState({ loading : true })
    Network.getOrders(dateFns.format(this.state.selectedDate, 'd+MMMM'), this.updateStatus.bind(this), this.updateOrders.bind(this))
  }

  updateStatus(status) {
    this.setState({ status });
  }

  updateOrders(orders) {
    this.setState({ orders });
    this.setState({ loading : false })
    console.log(orders)
  }

  handleClickOrder(order) {
    this.setState({ modal: true})
    this.setState({ order })
  }

  handleClose(){
    this.setState({ modal: false})
  }

  componentDidMount() {
    Network.getOrders(dateFns.format(this.state.selectedDate, "d+MMMM"), this.updateStatus.bind(this), this.updateOrders.bind(this))
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
                  <Cached />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>

          <Paper className="root">
          {this.state.loading ? 
            <CircularProgress/>
            : 
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Ammount (£)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.orders ? this.state.orders.map((order, index) => (
                  <TableRow hover key={index} onClick={() => { this.handleClickOrder(order) }}>
                    <TableCell align="left">{order.email}</TableCell>
                    <TableCell align="right">{dateFns.format(order.date, 'dd/MM/yyyy | HH:mm:ss')}</TableCell>
                    <TableCell align="right">{order.ammount}</TableCell>
                  </TableRow>
                )) : <div />}
              </TableBody>
            </Table>
          }
          </Paper>
          <Dialog
            open={this.state.modal}
            onClose={this.handleClose.bind(this)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{this.state.order ? <p>{this.state.order.email}</p> : <p>Nothing loaded</p>}</DialogTitle>
            <DialogContent>
              {this.state.order ? this.state.order.basket.map((item, index) => (<p>{item.name} {item.quantity} {item.unit}</p>)) : <div />}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose.bind(this)} color="primary" autoFocus>
                OK
            </Button>
            </DialogActions>
          </Dialog>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default App;
