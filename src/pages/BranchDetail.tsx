import React, {useEffect, useState} from "react";
import {Card, CardContent, CircularProgress, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {branch, REQUEST_STATUS} from "../types/Types";
import {withRouter} from "react-router-dom";
import axios from "axios";
import ls from 'localstorage-ttl';

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        width: '80%',
        margin: "auto",
        marginTop: "15vh"
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    progress: {
        display: "flex",
        height: "40vh",
        justifyContent: "center",
        alignItems: "center"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4, 4, 3),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '30vw',
        height: '30vh',
    },
}));

function BranchDetail({match}: any): JSX.Element {
    const classes = useStyles();

    const [status, setStatus] = useState<REQUEST_STATUS>(REQUEST_STATUS.SUCCEED);
    const [branch, setBranch] = useState<branch | null>(null);

    useEffect(() => {
        setStatus(REQUEST_STATUS.LOADING);
        const {params: {branchID}} = match;
        const url: string = `https://fyle-challenge-backend.herokuapp.com/api/branches/${branchID}`;
        const cache: string | null = ls.get(url);
        if (cache) {
            setStatus(REQUEST_STATUS.SUCCEED);
            setBranch(JSON.parse(cache));
        } else {
            axios.get(url)
                .then(res => {
                    setStatus(REQUEST_STATUS.SUCCEED);
                    setBranch(res.data);
                    ls.set(url, JSON.stringify(res.data), [10 * 60 * 1000]);
                })
                .catch(err => {
                    setStatus(REQUEST_STATUS.ERROR);
                    console.error(err.response);
                })
        }
    }, []);

    const getContent = (): JSX.Element => {

        switch (status) {
            case REQUEST_STATUS.SUCCEED:
                if (!branch)
                    return (
                        <div>Branch data unavailable</div>
                    );
                return (
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {branch.branch}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            {branch.city}
                        </Typography>
                        <Typography variant="body2" component="span">
                            IFSC :&nbsp;
                        </Typography>
                        <Typography variant="body2" component="span" color="textSecondary">
                            {branch.ifsc}
                        </Typography>
                        <br/>
                        <Typography variant="body2" component="span">
                            Bank :&nbsp;
                        </Typography>
                        <Typography variant="body2" component="span" color="textSecondary">
                            {branch.bank}
                        </Typography>
                        <br/>
                        <br/>

                        <Typography variant="body1" component="h6">
                            Address
                        </Typography>
                        <Typography variant="body2" component="span" color="textSecondary">
                            {branch.address}
                        </Typography>
                        <br/>
                        <Typography variant="body2" component="span">
                            District :&nbsp;
                        </Typography>
                        <Typography variant="body2" component="span" color="textSecondary">
                            {branch.district}
                        </Typography>
                        <br/>
                        <Typography variant="body2" component="span">
                            State :&nbsp;
                        </Typography>
                        <Typography variant="body2" component="span" color="textSecondary">
                            {branch.state}
                        </Typography>

                    </CardContent>
                );
            case REQUEST_STATUS.ERROR:
                return (
                    <div>An Error Occurred</div>
                );
            default:
                return (
                    <div className={classes.progress}>
                        <CircularProgress/>
                    </div>
                );
        }
    }

    return (
        <div style={{marginTop: "100px", padding: "10px 150px"}}>
            <Typography variant="h3" component="h3">
                Branch Details
            </Typography>
            <Card className={classes.card} variant="outlined">
                {
                    getContent()
                }
            </Card>
        </div>
    );
}

// @ts-ignore
export default withRouter(BranchDetail);