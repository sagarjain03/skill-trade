"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, MessageCircle, Plus, Send, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike, syncLikedPosts } from "@/lib/redux/features/CommunityData/communitySlice";
import { RootState } from "@/lib/redux/store";

const rankColors = {
  S: "from-yellow-400 to-amber-600",
  A: "from-purple-500 to-purple-700",
  B: "from-blue-500 to-blue-700",
  C: "from-green-500 to-green-700",
  D: "from-orange-500 to-orange-700",
  Beginner: "from-gray-500 to-gray-700",
};

const rankBorderColors = {
  S: "border-yellow-400",
  A: "border-purple-500",
  B: "border-blue-500",
  C: "border-green-500",
  D: "border-orange-500",
  Beginner: "border-gray-500",
};

export default function CommunityPage() {
  interface Post {
    _id: string;
    content: string;
    likes: number;
    isLiked: boolean;
    comments: {
      content: string;
      user: {
        username: string;
        profilePic: string;
      };
      createdAt: string;
    };
    tags: string[];
    user: {
      username: string;
      profilePic: string;
      rank: string;
    };
    createdAt: string;
  }


  const [newPost, setNewPost] = useState("");
  const [tags, setTags] = useState<string[]>([]); // State for tags
  const [tagInput, setTagInput] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  // const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string | null>(null); // Track the selected post for comments
  const [commentInput, setCommentInput] = useState(""); // Input for adding a comment


  const dispatch = useDispatch();
  const likedPosts = useSelector((state: RootState) => state.community.likedPosts);


  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/community/posts");
      setPosts(response.data.posts);
      // Extract the IDs of posts that the current user has liked
      if (response.data.likedPostsMap) {
        dispatch(syncLikedPosts(response.data.likedPostsMap));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput(""); // Clear the input field
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleLike = async (postid: string) => {
    try {
      // const post = posts.find((p: any) => p._id === postid);
      // if (!post) return;

      // Optimistically update the likes count
      dispatch(toggleLike(postid));


      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postid) {
            const newIsLiked = !Boolean(likedPosts[postid]);
            return {
              ...post,
              likes: newIsLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
              isLiked: newIsLiked
            };
          }
          return post;
        })
      );

      // setPosts((prevPosts) =>
      //   prevPosts.map((p: any) =>
      //     p._id === postid ? { ...p, likes: updatedLikes } : p
      //   )
      // );

      // Send the like request to the backend
      const response = await axios.post(`/api/community/posts/${postid}/likes`);

      // Update the post's like count locally with data from the response
      if (response.data.success) {
        setPosts(prevPosts =>
          prevPosts.map(post => {
            if (post._id === postid) {
              return {
                ...post,
                likes: response.data.likes,
                isLiked: response.data.liked
              };
            }
            return post;
          })
        );
      }
    }
    catch (error) {
      console.error("Error liking post:", error);
      dispatch(toggleLike(postid));
      fetchPosts(); // Re-fetch posts to ensure the UI is in sync with the server
    }
  };

  const handleAddComment = async (postid: string, commentText: string) => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`/api/community/posts/${postid}/comments`, {
        text: commentText,
      });

      const updatedComments = response.data.comments;

      // Update the comments for the specific post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postid ? { ...post, comments: updatedComments } : post
        )
      );

      setCommentInput(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleViewComments = async (postid: string) => {
    try {
      console.log("Attempting to fetch post:", postid);
      const response = await axios.get(`/api/community/posts/${postid}`);
      console.log("Post data received:", response.data);
      setSelectedPost(response.data.post); // Set the selected post with comments
      setSelectedPost(prev => prev === postid ? null : postid);
      setCommentInput("");
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };


  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await axios.post("/api/community/posts", {
        content: newPost,
        tags,
      });

      const { post } = response.data;

      // Update the posts list with the new post
      setPosts((prevPosts) => [post, ...prevPosts]);

      // Clear the input field
      setNewPost("");
      setTags([]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-2 h-6 w-6 text-green-400" />
        Community Guild
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Create Post</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your thoughts, ask for help, or celebrate your achievements..."
                className="bg-gray-800 border-gray-700 focus:border-green-500 min-h-24"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    className="bg-gray-800 border-gray-700 focus:border-green-500"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-gray-700 bg-gray-800"
                    onClick={handleAddTag}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-800 text-xs flex items-center space-x-1"
                    >
                      <span>#{tag}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreatePost}>
                <Send className="h-4 w-4 mr-2" /> Post
              </Button>
            </CardFooter>
          </Card>

          {isLoading ? (
            <p>Loading posts...</p>
          ) : (
            posts.map((post: any) => (
              <Card
                key={post._id}
                className={cn(
                  "bg-gray-900 border-gray-800 transition-all duration-300",
                  likedPosts[post._id] && "ring-1 ring-green-500/50"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar
                        className={cn(
                          "h-8 w-8 mr-2 border",
                          rankBorderColors[post.user.rank as keyof typeof rankBorderColors]
                        )}
                      >
                        <AvatarImage src={post.user.profilePic || "/placeholder.svg"} alt={post.user.username} />
                        <AvatarFallback>{post.user.username.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{post.user.username}</span>
                          <div
                            className={cn(
                              "ml-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br",
                              rankColors[post.user.rank as keyof typeof rankColors]
                            )}
                          >
                            {post.user?.rank?.substring(0, 2)} {/* Display the rank inside the circle */}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-3">{post.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-800 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("text-xs flex items-center", likedPosts[post._id] && "text-green-400")}
                      onClick={() => handleLike(post._id)}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex items-center"
                      onClick={() => setSelectedPost((prev) => (prev === post._id ? null : post._id))} // Toggle comments
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {post.comments?.length || 0}
                    </Button>
                  </div>
                </CardFooter>
                {selectedPost === post._id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-gray-800 pt-4 space-y-4">
                      {/* Comments Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold">Comments</h3>
                      </div>

                      {/* Existing Comments */}
                      {post.comments
                        ?.slice() // Create a shallow copy of the comments array
                        .reverse() // Reverse the order to show the latest comments first
                        .map((comment: any, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.user?.profilePic || "/placeholder.svg"} />
                              <AvatarFallback>
                                {comment.user?.username?.substring(0, 2) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium">{comment.user?.username || "Anonymous"}</p>
                                <div
                                  className={cn(
                                    "ml-2 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br",
                                    rankColors[comment.user?.rank as keyof typeof rankColors]
                                  )}
                                >
                                  {comment.user?.rank?.substring(0, 2) || ""}
                                </div>
                              </div>
                              <p className="text-sm text-gray-400">{comment.content}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Comment Input */}
                      <div className="flex space-x-2">
                        {/* <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" alt="Your avatar" />
                          <AvatarFallback>YO</AvatarFallback>
                        </Avatar> */}
                        <div className="flex-1">
                          <Textarea
                            placeholder="Write a comment..."
                            className="bg-gray-800 border-gray-700 focus:border-green-500 min-h-8 text-xs py-2"
                            rows={2}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment(post._id, commentInput);
                              }
                            }}
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => handleAddComment(post._id, commentInput)}
                            >
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>


        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Guild Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "MasterCoder", rank: "S", points: 12450, avatar: "/placeholder.svg?height=40&width=40" },
                  { name: "DesignGuru", rank: "A", points: 8320, avatar: "/placeholder.svg?height=40&width=40" },
                  { name: "DataWizard", rank: "A", points: 7890, avatar: "/placeholder.svg?height=40&width=40" },
                  { name: "WebDev101", rank: "B", points: 5430, avatar: "/placeholder.svg?height=40&width=40" },
                  {
                    name: "You",
                    rank: "B",
                    points: 2450,
                    avatar: "/placeholder.svg?height=40&width=40",
                    isCurrentUser: true,
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center p-2 rounded-lg",
                      user.isCurrentUser ? "bg-green-500/10 border border-green-500/30" : "hover:bg-gray-800",
                    )}
                  >
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-800 text-xs font-medium mr-2">
                      {index + 1}
                    </div>
                    <Avatar
                      className={cn(
                        "h-8 w-8 mr-2 border",
                        rankBorderColors[user.rank as keyof typeof rankBorderColors],
                      )}
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{user.name}</span>
                        <div
                          className={cn(
                            "ml-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-gradient-to-br",
                            rankColors[user.rank as keyof typeof rankColors],
                          )}
                        >
                          {user.rank}
                        </div>
                        {index === 0 && (
                          <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 text-[10px]">
                            {/* <Award className="h-2 w-2 mr-1" /> Top Contributor */}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{user.points.toLocaleString()} points</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Quests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Help 5 community members", reward: 100, progress: 3, total: 5 },
                  { title: "Complete 3 skill exchanges", reward: 150, progress: 1, total: 3 },
                  { title: "Rate 10 learning sessions", reward: 200, progress: 7, total: 10 },
                ].map((quest, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium">{quest.title}</h3>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">+{quest.reward} XP</Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      {quest.progress}/{quest.total} completed
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
