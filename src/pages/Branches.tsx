import React, {useEffect, useState} from 'react';
import {createStyles, fade, makeStyles, Theme} from "@material-ui/core/styles";
import {
    CircularProgress,
    FormControl,
    InputBase,
    InputLabel,
    MenuItem,
    Select,
    TableContainer,
    TablePagination
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import axios from 'axios';
import {branch, REQUEST_STATUS, response} from "../types/Types";
import DataTable from '../components/DataTable';
import ls from 'localstorage-ttl';

function Branches(): JSX.Element {
    const classes = useStyles();
    const [data, setData] = useState<response>({count: 0, branches: []});
    const [branches, setBranches] = useState<branch[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(30);
    const [page, setPage] = useState<number>(0);
    const [status, setStatus] = useState<REQUEST_STATUS>(REQUEST_STATUS.SUCCEED);
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [query, setQuery] = useState<string>('');

    useEffect(() => {
        setStatus(REQUEST_STATUS.LOADING);
        const url: string = `https://fyle-challenge-backend.herokuapp.com/api/branches?q=${query}&limit=${rowsPerPage}&offset=${page * rowsPerPage}`;
        const cache: string | null = ls.get(url);
        if (cache) {
            setStatus(REQUEST_STATUS.SUCCEED);
            setData(JSON.parse(cache));
        } else {
            axios.get(url)
                .then(res => {
                    setStatus(REQUEST_STATUS.SUCCEED);
                    setData({count: res.data.count, branches: res.data.results});
                    ls.set(url, JSON.stringify({count: res.data.count, branches: res.data.results}), [10 * 60 * 1000]);
                })
                .catch(err => {
                    setStatus(REQUEST_STATUS.ERROR);
                    console.error(err.response);
                })
        }
    }, [page, rowsPerPage, query]);

    useEffect(() => {
        setBranches(
            data.branches.filter(branch => {
                const flag: boolean = branch.state.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    branch.branch.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    branch.bank.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    branch.address.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    branch.ifsc.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    branch.city.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    branch.district.toLowerCase().includes(filterQuery.toLowerCase());
                if (query)
                    return flag && branch.city.toLowerCase() === query.toLowerCase();
                else
                    return flag;
            })
        );

    }, [filterQuery, data])

    const getContent = (): JSX.Element => {
        switch (status) {
            case REQUEST_STATUS.SUCCEED:
                return (
                    <div className={classes.tableDiv}>
                        <DataTable offset={page * rowsPerPage} branches={branches}/>
                    </div>
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
        <div className={classes.mainDiv}>
            <TableContainer className={classes.tableDiv}>
                <div>
                    <h2>Bank Branches</h2>
                    <div className={classes.opts}>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="label">City</InputLabel>
                            <Select
                                displayEmpty={true}
                                className={classes.selectEmpty}
                                labelId="label"
                                onChange={e => {
                                    setFilterQuery('');
                                    setQuery(e.target.value as string);
                                }}
                            >
                                <MenuItem value="" defaultChecked>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={"alwar"}>Alwar</MenuItem>
                                <MenuItem value={"jaipur"}>Jaipur</MenuItem>
                                <MenuItem value={"mumbai"}>Mumbai</MenuItem>
                                <MenuItem value={"delhi"}>Delhi</MenuItem>
                                <MenuItem value={"kolkata"}>Kolkata</MenuItem>
                            </Select>
                        </FormControl>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon/>
                            </div>
                            <InputBase
                                placeholder={"Filter"}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                value={filterQuery}
                                onChange={e => setFilterQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {
                    getContent()
                }
            </TableContainer>
            {
                status === REQUEST_STATUS.SUCCEED && (
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30, 50, 100]}
                        component="div"
                        count={data.count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={(e, newPage) => {
                            setPage(newPage);
                        }}
                        onChangeRowsPerPage={(e) => {
                            setRowsPerPage(Number(e.target.value));
                        }}
                    />
                )
            }
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    mainDiv: {
        marginBottom: '10vh',
        padding: '50px 10vw',
    },
    opts: {
        display: "flex",
        justifyContent: "space-around",
    },
    tableDiv: {
        textAlign: 'center',
        marginTop: '5vh'
    },
    title: {
        display: "inline-block"
    },
    search: {
        height: '33px',
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
        border: '1px solid black',
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 2, 2, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 150,
            '&:focus': {
                width: 200,
            },
        },
    },
    progress: {
        display: "flex",
        height: "60vh",
        justifyContent: "center",
        alignItems: "center"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default Branches;
