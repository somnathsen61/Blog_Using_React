//localhost:3000/articles/learn-react
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";

const ArticlePage= ()=>{
    const [articleInfo, setArticleInfo]= useState({upvotes:0, comments: []});
    const {articleId}= useParams();

    useEffect(()=>{
        const loadArticleInfo= async ()=>{
            const response= await axios.get(`/api/articles/${articleId}`);
            const newArticleInfo= response.data;
            setArticleInfo(newArticleInfo);
        }
        loadArticleInfo();
    },[articleInfo]);

    const addUpvotes= async ()=>{
        const response = await axios.put(`/api/articles/${articleId}/upvotes`);
        const newArticleInfo= response.data;
        setArticleInfo(newArticleInfo);
    }

    const article= articles.find(article=> article.name === articleId)
    if(!article)
        return <NotFoundPage />
    return(
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            <button onClick={addUpvotes}>Upvote</button>
            <p>This article has {articleInfo.upvotes} upvotes</p>
        </div>
        {article.content.map((paragraph,ind) =>
            <p key={ind} >{paragraph}</p>
        )}
        <AddCommentForm 
            articleName={articleId}
            onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}
        />
        <CommentsList comments={articleInfo.comments}/>
        </>
    );
}

export default ArticlePage;