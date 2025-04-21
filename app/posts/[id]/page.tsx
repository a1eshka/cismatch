const PostsPageDetail = async ({ params }: { params: { id: string } }) => {
  return <div>Post ID: {params.id}</div>;
};

export default PostsPageDetail;