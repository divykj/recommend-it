import { Row, AutoComplete, Button, Col } from "@geist-ui/react"
import { useState } from "react"
import axios from 'axios'
import serverAPI from './config';

const SearchForm = ({ addtoFavorites }) => {
    
      const [ options, setOptions ] = useState()
      const [ formValue, setFormValue ] = useState('')
      const [ searching, setSearching ] = useState(false)
      const [ selected, setSelected ] = useState('')

      const searchHandler = async (currentValue) => {
        if (!currentValue) return setOptions([])
        setSearching(true)
        let searchedOptions = []
        try {
            const { data } = await axios.get(`${serverAPI}/movies/?q=${currentValue}`)
            const dataList = data.map(({name, id}) => ({ label:name, value:name, id }) )    
            searchedOptions = dataList.filter(item => item.value.includes(currentValue))
        } catch(err) {
            console.error(err)
        }
        setOptions(searchedOptions)
        setSearching(false)
    }

    return (
        <Row justify='center' gap={0.5}>
            <Col>
                <AutoComplete searching={searching}
                    width="100%"
                    options={options}
                    placeholder="Search movies ..."
                    onSearch={searchHandler}
                    value={formValue} 
                    onChange={setFormValue}
                    onSelect={select => setSelected(select)}
                    clearable
                />
            </Col>
            <Col span={6}>
                <Button type="secondary" ghost  className="search-btn" onClick={() => {
                    if(options !== undefined && options.length !== 0) {
                        if(selected === '') return
                        addtoFavorites(options.find(({ value }) => value === selected ))
                        setFormValue('')
                        setSelected('')
                        setOptions()
                    }
                }}>
                    Add
                </Button>
            </Col>
        </Row>
    )
}

export default SearchForm
