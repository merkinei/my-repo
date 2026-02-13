import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing API state
 */
export const useApi = <T = any>(initialData: T | null = null) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setData = useCallback((data: T) => {
    setState({ data, loading: false, error: null });
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  return { ...state, setLoading, setData, setError };
};

/**
 * Hook for GET requests
 */
export const useApiGet = <T = any>(endpoint: string, skip = false) => {
  const state = useApi<T>(null);

  const fetch = useCallback(async () => {
    if (skip) return;

    state.setLoading(true);
    const { data, error } = await apiGet<T>(endpoint);

    if (error) {
      state.setError(error);
    } else {
      state.setData(data || ({} as T));
    }
  }, [endpoint, skip, state]);

  return { ...state, fetch };
};

/**
 * Hook for POST requests
 */
export const useApiPost = <T = any>() => {
  const state = useApi<T>(null);

  const post = useCallback(
    async (endpoint: string, body: any) => {
      state.setLoading(true);
      const { data, error } = await apiPost<T>(endpoint, body);

      if (error) {
        state.setError(error);
        return null;
      } else {
        state.setData(data || ({} as T));
        return data;
      }
    },
    [state]
  );

  return { ...state, post };
};

/**
 * Hook for PUT requests
 */
export const useApiPut = <T = any>() => {
  const state = useApi<T>(null);

  const put = useCallback(
    async (endpoint: string, body: any) => {
      state.setLoading(true);
      const { data, error } = await apiPut<T>(endpoint, body);

      if (error) {
        state.setError(error);
        return null;
      } else {
        state.setData(data || ({} as T));
        return data;
      }
    },
    [state]
  );

  return { ...state, put };
};

/**
 * Hook for DELETE requests
 */
export const useApiDelete = <T = any>() => {
  const state = useApi<T>(null);

  const deleteItem = useCallback(
    async (endpoint: string) => {
      state.setLoading(true);
      const { data, error } = await apiDelete<T>(endpoint);

      if (error) {
        state.setError(error);
        return null;
      } else {
        state.setData(data || ({} as T));
        return data;
      }
    },
    [state]
  );

  return { ...state, delete: deleteItem };
};

/**
 * Example Usage:
 *
 * export const MyComponent = () => {
 *   const { data: posts, loading, error, fetch } = useApiGet('/posts');
 *   const { post, loading: creating } = useApiPost();
 *   const { delete: deletePost } = useApiDelete();
 *
 *   useEffect(() => {
 *     fetch();
 *   }, [fetch]);
 *
 *   const handleCreate = async () => {
 *     await post('/posts', { title: 'New Post', content: 'Hello' });
 *   };
 *
 *   const handleDelete = async (id: string) => {
 *     await deletePost(`/posts/${id}`);
 *   };
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {posts?.length ? posts.map(p => (
 *         <div key={p.id}>
 *           <h3>{p.title}</h3>
 *           <button onClick={() => handleDelete(p.id)}>Delete</button>
 *         </div>
 *       )) : <p>No posts</p>}
 *     </div>
 *   );
 * };
 */
