import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const fetchTest = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  return data;
};
export const queryTest: any = () => {
  toast.success("요청을 보냈습니다.");
  return useQuery({
    queryKey: ["test"],
    queryFn: fetchTest,
  });
};
