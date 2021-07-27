import { useState } from 'react'
import { gql, useQuery } from "@apollo/client"
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { times } from 'lodash'

import { SortBy } from '../__generated__'
import { GetLaunches_launches } from '../__generated__'

import { GRAPHQL_URL, SHADOW_ROW_COUNT } from '../libs/constants'
import Search from './search'

const LAUNCHES = gql`query GetLaunches(
  $launchesSortBy: SortBy
  $launchesSearchByStartDate: Int
  $launchesSearchByEndDate: Int
  $launchesSearchByMission: String
  $launchesSearchByRocket: String
) {
  launches(
    sortBy: $launchesSortBy
    searchByStartDate: $launchesSearchByStartDate
    searchByEndDate: $launchesSearchByEndDate
    searchByMission: $launchesSearchByMission
    searchByRocket: $launchesSearchByRocket
  ) {
    missionName
    rocketName
    launchDate
    videoLink
  }
}`

export default function LaunchTable() {
  const [sort, setSort] = useState<SortBy>(SortBy.launch_date_desc)
  const [missionSearch, setMissionSearch] = useState<string>('')
  const [rocketSearch, setRocketSearch] = useState<string>('')
  const [startSearch, setStartSearch] = useState<number | ''>('')
  const [endSearch, setEndSearch] = useState<number | ''>('')

  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [active, setActive] = useState('date')
  const [launches, setLaunches] = useState<GetLaunches_launches[]>([])
  const { loading, error } = useQuery(LAUNCHES, {
    variables: {
      launchesSortBy: sort,
      launchesSearchByStartDate: startSearch || null,
      launchesSearchByEndDate: endSearch || null,
      launchesSearchByMission: missionSearch,
      launchesSearchByRocket: rocketSearch,
    },
    onCompleted: data => {
      setLaunches(data.launches)
    }
  })

  const headCells = {
    mission: {
      numeric: false, label: 'Mission',
      sort: { asc: SortBy.mission_name_asc, desc: SortBy.mission_name_desc },
    },
    date: {
      numeric: true, label: 'Date',
      sort: { asc: SortBy.launch_date_asc, desc: SortBy.launch_date_desc },
    },
    rocket: {
      numeric: true, label: 'Rocket',
      sort: { asc: SortBy.rocket_name_asc, desc: SortBy.rocket_name_desc },
    }
  }

  if (error) return <p style={{ fontSize: 45 }}>Error:  Make sure you've started your graphql server at { GRAPHQL_URL }.</p>

  const createSortHandler = (property: 'mission' | 'date' | 'rocket', e: any) => {
    let scopedOrder: 'asc' | 'desc'
    if (active === property) {
      scopedOrder = order === 'asc' ? 'desc' : 'asc'
      setOrder(() => scopedOrder)
    } else {
      scopedOrder = 'asc'
      setOrder(() => scopedOrder)
    }
    setActive(() => property)
    setSort(() => headCells[property].sort[scopedOrder])
  }

  const getRandomWidth = (min: number, max: number) => `${(Math.random() * (max - min) + min)}px`
  const convertToMs = (date: number) => date * 1000
  const convertFromMs = (date: number) => date / 1000

  const handleStartDate = (date: MaterialUiPickersDate) => {
    setStartSearch(() => date ? convertFromMs(date.getTime()) : '')
  }

  const handleEndDate = (date: MaterialUiPickersDate) => {
    setEndSearch(() => date ? convertFromMs(date.getTime()) : '')
  }

  const removeDates = () => {
    setStartSearch(() => '')
    setEndSearch(() => '')
  }

  return (
    <TableContainer className='tablecontainer' component={Paper}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            {(Object.keys(headCells) as Array<keyof typeof headCells>).map((headCell) => (
              <TableCell key={headCell} align="left" sortDirection="desc">

                <TableSortLabel
                  active={headCell === active}
                  direction={order}
                  onClick={(e) => createSortHandler(headCell, e)}
                >
                  {headCells[headCell].label}
                </TableSortLabel>
              </TableCell>))}
            <TableCell align="left">Video</TableCell>
          </TableRow>
          <TableRow>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow key="filter">
            <TableCell align="left">
              <Search filter={setMissionSearch} />
            </TableCell>
            <TableCell align="left">

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="start-search"
                  label="Start"
                  value={startSearch ? new Date(convertToMs(startSearch)) : null}
                  onChange={handleStartDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <br />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="end-search"
                  label="End"
                  value={endSearch ? new Date(convertToMs(endSearch)) : null}
                  onChange={handleEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <br />
                {startSearch || endSearch ? <button className="remove" onClick={removeDates}>Remove</button> : null}
                </>
              </MuiPickersUtilsProvider>
            </TableCell>
            <TableCell align="left">
              <Search filter={setRocketSearch} />
            </TableCell>

          </TableRow>
          <>
            {loading ?
              (times(SHADOW_ROW_COUNT).map((_e, i) => (
                <TableRow key={`skeleton${i}`}>
                  <TableCell align="left"><div style={{ width: getRandomWidth(100, 150) }} className="skeleton"></div></TableCell>
                  <TableCell align="left"><div style={{ width: getRandomWidth(50, 70) }} className="skeleton"></div></TableCell>
                  <TableCell align="left"><div style={{ width: getRandomWidth(40, 70) }} className="skeleton"></div></TableCell>
                  <TableCell align="left"><div style={{ width: getRandomWidth(200, 300) }} className="skeleton"></div></TableCell>
                </TableRow>
              )))
              :
              launches.map((row: any) => (
                <TableRow key={row.missionName}>
                  <TableCell align="left">{row.missionName}</TableCell>
                  <TableCell align="left">{(new Date(row.launchDate * 1000)).toDateString()}</TableCell>
                  <TableCell align="left">{row.rocketName}</TableCell>
                  <TableCell align="left"><a target="_blank" href={row.videoLink}>{row.videoLink}</a></TableCell>
                </TableRow>
              ))
            }</>
        </TableBody>
      </Table>
    </TableContainer>
  )
}