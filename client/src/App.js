import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import { Paper, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { Checkbox, IconButton, TextField, Button, Grid, makeStyles } from '@material-ui/core';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import AddIcon from '@material-ui/icons/Add';
import DateRangeTwoToneIcon from '@material-ui/icons/DateRangeTwoTone';

const GET_TODOS = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

const CREATE_TODO = gql`
    mutation createTodo($text: String!) {
        createTodo(text: $text) {
          id
          text
          complete
        }
    } 
`;

const UPDATE_TODO = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  } 
`;

const REMOVE_TODO = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;

const useStyles = makeStyles({
  body: {
    backgroundImage: `url("https://wallpapercave.com/wp/wp4685294.jpg")`,   
    backgroundSize: 'cover',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    justify: 'space-evenly',
    flexGrow: 1,
    margin: '20px'
  },
  field: {
    margin: '5px 0 20px 0',
    flex: 1
  },
});

function App() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setDateTime(new Date()), 1000);
    return () => {
      clearInterval(id);
    }
  }, []);

  const [task, setTask] = useState("");
  const classes = useStyles();

  const { data, loading, error } = useQuery(GET_TODOS);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [removeTodo] = useMutation(REMOVE_TODO);
  const [createTodo] = useMutation(CREATE_TODO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div className={classes.body} style={{ display: 'flex', padding: '138px' }}>
      <div style={{ margin: 'auto' }}>
        <Paper elevation={1} style={{ padding: '25px', background: 'linear-gradient(45deg, #FAC6BF 30%, #CFFFE5 90%)'}}>
          <Button startIcon={<DateRangeTwoToneIcon />}>
            <a href="https://classroom.google.com/calendar/this-week/course/all" target="__blank">GOOGLE CLASSROOM CALENDAR</a>
          </Button>
          <form className={classes.form}>
          <h4>{`${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`}</h4>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <TextField 
                  value={task}
                  placeholder="Enter a todo task..."
                  margin="normal"
                  className={classes.field}
                  onChange={e => setTask(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>  
                <Button
                  startIcon={<AddIcon />}
                  onClick={e => {
                      e.preventDefault();
                      setTask("");
                      createTodo({
                          variables: {
                              text: task
                          },
                          refetchQueries: [ { query: GET_TODOS }]
                      })
                  }}
                >
                  ADD
                </Button>
              </Grid>
            </Grid>
          </form>
          <List>
            {data.todos.map((todo) => {
              
              return (
                <ListItem key={todo.id}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.complete}
                      onClick={e => {
                        e.preventDefault();
                        updateTodo({ 
                          variables: { 
                            id: todo.id, complete: !todo.complete 
                          },
                          refetchQueries: [ { query: GET_TODOS }]
                        });
                        // window.location.reload();
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={todo.text} style={{ marginRight: '22px' }} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={e => {
                        e.preventDefault();
                        removeTodo({
                          variables: { id: todo.id },
                          refetchQueries: [ { query: GET_TODOS }]
                        });
                      }}
                    >
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default App;
