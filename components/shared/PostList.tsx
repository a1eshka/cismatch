"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import PostListItem from "./PostListItem";
import { Container } from "./Conatiner";
import apiService from "@/app/services/apiService";

export type PostType = {
  id: string;
  title: string;
  body: string;
  author: {
    id: string;
    name: string;
    steam_avatar: string;
    avatar_url: string;
  };
  createdAt: string;
  formatted_date: string;
  formatted_time: string;
  role: {
    id: string;
    title: string;
  };
  type: {
    id: string;
    title: string;
  };
  status: {
    id: string;
    title: string;
  };
  image_url: string;
  views: number;
};

const POSTS_PER_PAGE = 15;

const fetcher = (url: string) => apiService.get(url).then((res) => res.data);

const PostList = () => {
  const { data: allPosts, error } = useSWR("/api/posts", fetcher);
  const [displayedPosts, setDisplayedPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("Все");

  useEffect(() => {
    if (allPosts) {
      const sortedPosts = allPosts.sort(
        (a: PostType, b: PostType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setDisplayedPosts(sortedPosts.slice(0, page * POSTS_PER_PAGE));
    }
  }, [allPosts, page]);

  const loadMorePosts = () => {
    if (allPosts && displayedPosts.length < allPosts.length) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 &&
        displayedPosts.length < (allPosts?.length || 0)
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedPosts, allPosts]);

  if (error) return <Container>Ошибка загрузки постов.</Container>;
  if (!allPosts) 
    return (
        <Container>
        <div role="status" className="max-w-sm p-4  rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            
            <div className="h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-600/50  rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="flex items-center justify-center h-48 mb-4 bg-gray-600/50 rounded dark:bg-gray-700">
            </div>
            <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700"></div>
            <div className="flex items-center mt-4">
            <svg className="w-10 h-10 me-3  dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
                <div>
                    <div className="h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                    <div className="w-48 h-2 bg-gray-600/50 rounded-full dark:bg-gray-700"></div>
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
        </Container>
    );

  const filteredPosts = displayedPosts.filter((post) =>
    filter === "Все" ? true : post.type.title === filter
  );

  return (
    <>
      <Container className="flex flex-col">
        <div className="flex gap-1 my-2">
          {["Все", "Пост", "Поиск"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 text-xs rounded-lg transition ${
                filter === type ? "border border-gray-800 bg-gray-400/20 text-white" : "border border-gray-800 text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {filteredPosts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}

        {displayedPosts.length < allPosts.length && (
          <button
            onClick={loadMorePosts}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg mt-4 mx-auto"
          >
            Загрузить ещё
          </button>
        )}
      </Container>
    </>
  );
};

export default PostList;
