import apiService from "@/app/services/apiService";

const PostsPageDetail = async ({ params }: { params: { id: string } }) => {
  const post = await apiService.get(`/api/post/${params.id}/`);
  return <div>{post.title}</div>;
};
export default PostsPageDetail;