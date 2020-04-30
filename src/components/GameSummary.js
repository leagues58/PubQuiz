import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const GameSummary = ({teams, questions, answers}) => {
  let teamTotals = [];
  const classes = useStyles();
  const teamIds = teams.map((team) => team.id);

  const getAnswers = (question) => {
    let result = [];
    
    teamIds.forEach((teamId, index) => {
      let points = answers?.find(a => a.teamId === teamId && a.questionId === question.id && !a.isWager)?.points;

      if (points === undefined) {
        points = null;
      }
      result.push(points);
      let currentPoints = teamTotals[index] ? teamTotals[index] : 0;
      teamTotals[index] = currentPoints + Number(points);
    });

    return result;
  };


  return (
    <div style={{display: 'flex', flexDirection:'column', width:'99%'}}>
      <h3>Game Summary</h3>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            {teams.map(team => {
              return (
                <TableCell align="right">({team.number}) {team.teamName}</TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question, index) => {
            const answerSet = getAnswers(question)
            return (
            <TableRow key={question.id}>
              <TableCell component="th" scope="row">
                {index+1}.
              </TableCell>
              {answerSet.map((cell, index) => {
                return (<TableCell align="right">{cell}</TableCell>);
              })}
            </TableRow>
            );
          })}
          <TableRow>
              <TableCell component="th" scope="row">
                <b>Total</b>
              </TableCell>
              {teamTotals.map(total => {
                return (
                  <TableCell align="right">{total}</TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GameSummary;