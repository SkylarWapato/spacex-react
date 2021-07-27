import { Dispatch, SetStateAction } from "react"
import {
  Input,
  InputAdornment,
} from "@material-ui/core"
import { debounce } from "lodash"

export interface SearchProps {
  filter: Dispatch<SetStateAction<string>>
}

export default function Search({ filter }: SearchProps) {
  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    filter(() => e.target.value || '')
  }, 300)

  return (
    <Input
      onChange={handleChange}
      startAdornment={
        <InputAdornment position="start">

          <span className="material-icons">
            search
          </span>
        </InputAdornment>
      }
    />
  )
}