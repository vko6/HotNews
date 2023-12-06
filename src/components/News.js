import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import Spin from './Spin';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
 


const News = (props) => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0); 


    const cfl = (string) =>{
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    

    const updateNews = async () => {
      props.setProgress(50);
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=67c93b9990aa4ce39ea20d402f1e8df2&page=${page}&pageSize=${props.pageSize}`;
    
      setLoading(true)
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log(parsedData)

      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      
      props.setProgress(100);

    }

    useEffect(() => {
     document.title = `${cfl(props.category)} - HotNews`

      updateNews(); 
       /* eslint-disable-next-line */
    }, [] ); 

    const fetchMoreData = async () => {
      setPage(page+1);
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=67c93b9990aa4ce39ea20d402f1e8df2&page=${page+1}&pageSize=${props.pageSize}`;
   
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log(parsedData)
      
      setArticles(articles.concat(parsedData.articles))
      setTotalResults(parsedData.totalResults)     
    };

 
    return (
    <>
        <h1 className='text-center' style={{margin : '35px 0ox', marginTop: '90px' }}> <strong>Hot News - Top {cfl(props.category)} Headlines </strong> </h1>
          {loading && < Spin />}

          <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={< Spin />}
        >
          <div className='container'>
        <div className='row'>         
           {articles.map((e) => {
            return <div className='col-md-4' key={e.url}> 
            <NewsItem title = {e.title?e.title.slice(0,40):""  } description={e.description?e.description.slice(0,80): "" } imageUrl = {e.urlToImage}
                      newsUrl ={e.url} author={e.author} date={e.publishedAt} source = {e.source.name}/>
                </div>
           })}
        </div>
        </div>
        </InfiniteScroll>
  
       
      </>
    )
  }

  

News.defaultProps = {
  country : 'in',
  pageSize : 9,
  category : 'general',
}
News.propTypes = {
  country : PropTypes.string,
  pageSize : PropTypes.number, 
  category : PropTypes.string,
}

export default News
