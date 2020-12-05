import { useState } from 'react';
import { CssBaseline, GeistProvider, Row, Page, Card, Col, Tag, Text, Button } from '@geist-ui/react';
import SearchForm from './components/SearchForm';
import { X } from '@geist-ui/react-icons'
import axios from 'axios'

import './App.css';

const myTheme = {
  "type": "dark",
  "palette": {
    "accents_1": "#111",
    "accents_2": "#333",
    "accents_3": "#444",
    "accents_4": "#666",
    "accents_5": "#888",
    "accents_6": "#999",
    "accents_7": "#eaeaea",
    "accents_8": "#fafafa",
    "background": "#000",
    "foreground": "#fff",
    "selection": "#f81ce5",
    "secondary": "#888",
    "code": "#79ffe1",
    "border": "#333",
    "link": "#3291ff"
  },
  "expressiveness": {
    "dropdownBoxShadow": "0 0 0 1px #333",
    "shadowSmall": "0 0 0 1px #333",
    "shadowMedium": "0 0 0 1px #333",
    "shadowLarge": "0 0 0 1px #333",
    "portalOpacity": 0.75
  }
}

const PercentageBox = ({ number }) =>
  <div className="box">
    <div className="percent">
      <svg>
        <circle cx='46' cy='46' r='46'></circle>
        <circle cx='46' cy='46' r='46' style={{ 
          strokeDashoffset: `calc(289 - (289 * ${number}) / 100)`, 
          stroke: `${ number > 70 ? '#00ff43': number > 30 ? 'fdcc0d' : '#DE0913'}`
        }}></circle>
      </svg>
      <div className="number">
        <h4>{number}<span>%</span></h4>
      </div>
    </div>
    <h6>Match</h6>
  </div>

const MockItem = ({ recommend: { movie: { id, name, year }, score } }) => 
  <div className="movie-card">
    <Card className='flip-card-inner'>
      <div className="flip-front">
        <h6 className="movie-card-title">{ name }</h6>
        <p className="movie-card-year">{year}</p>
      </div>
      <div className="flip-back">
        <PercentageBox number={(score * 100).toFixed(0)} />
      </div>
    </Card>
  </div>

const App = () => {
  
  const [ favourites, setFavourites ] = useState([])
  const [ recommendationData, setRecommendationData ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  
  const addtoFavorites = val => {
    setFavourites(oldFavorites => oldFavorites.findIndex(({ id }) => id === val.id) === -1 ? [ ...oldFavorites, val ] : oldFavorites)
  }
  
  const removeFromFavourites = _id => {
    setFavourites(oldFavorites => oldFavorites.filter(({ id }) => id !== _id ))
  }
  
  const getRecommendation = async () => {
      const toSend = favourites.map(({ id }) => id)
      setLoading(true)
      const { data } = await axios.post('https://ef238fb7d333.ngrok.io/recommend/', toSend)
      setRecommendationData(data)
      setLoading(false)
  }

  const clearAll = () => {
    setFavourites([])
    setRecommendationData(null)
  }

  return (
    <GeistProvider theme={myTheme}>
      <CssBaseline />
      <Page>
        <Row justify='center' className='navbar'>
            <img src="/logo.png" alt="" width={60} height={60} /> <p>Recommend</p><Text type='warning'>It</Text>
        </Row>
        <SearchForm addtoFavorites={addtoFavorites} />
        <Card className="mt">
          <h3>Favourites List</h3>
          { favourites.length !== 0 
            ? favourites && favourites.map(({ id, label }) => 
                <Tag 
                key={id} 
                  type="dark" 
                  className="mr tag" 
                  invert 
                  onDoubleClick={()=> removeFromFavourites(id)}
                  >
                  {label}
                </Tag>
              ) 
              : <Text blockquote>Add your favourite movies and get amazing recommendations for your likings!</Text>
            }
          {
            favourites.length > 0 &&
            <Button type="error" className="clear-label" ghost size='small' auto onClick={clearAll} icon={<X />}>Clear All</Button>          
          }
        </Card>
        <Row justify='center' className='mt'>
          {
            favourites.length !== 0 
            ? <Button loading={loading} type="success" ghost onClick={getRecommendation}>Similar Movies</Button>
              : <img src={'/popcorn.png'} alt="" width={270} />
          }
        </Row>
        {
          recommendationData 
          ? recommendationData.length === 0
              ? <Text blockquote>Sorry! No Recommendation Found</Text>
              : recommendationData && recommendationData.map(({ recommendations, movie }) =>
                <div key={movie.name}>
                  <Row className="movie-title-row">
                    Similar to {movie.name} ({movie.year})
                  </Row>
                  <div className="overflow">
                    <Row className="movie-card-row">
                    {
                      recommendations.map((recommend,i) => 
                      <Col key={i+1}>
                        <MockItem recommend={recommend} />
                      </Col>
                    )}
                    </Row>
                  </div>
                </div> 
              )
            : <></>
        }
      </Page>
    </GeistProvider>
  );
}

export default App;
