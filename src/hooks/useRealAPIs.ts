import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Random User API
export const useRandomUser = () => {
  return useQuery({
    queryKey: ['randomUser'],
    queryFn: async () => {
      const response = await fetch('https://randomuser.me/api/');
      if (!response.ok) throw new Error('Failed to fetch random user');
      const data = await response.json();
      return data.results[0];
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Multiple Random Users
export const useMultipleRandomUsers = (count: number = 5) => {
  return useQuery({
    queryKey: ['randomUsers', count],
    queryFn: async () => {
      const response = await fetch(`https://randomuser.me/api/?results=${count}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.results;
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

// JSONPlaceholder Posts
export const usePosts = (limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', limit],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
};

// JSONPlaceholder Users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

// Create Post Mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost: { title: string; body: string; userId: number }) => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate posts query to refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Dog API
export const useRandomDog = () => {
  return useQuery({
    queryKey: ['randomDog'],
    queryFn: async () => {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      if (!response.ok) throw new Error('Failed to fetch dog');
      return response.json();
    },
    staleTime: 0, // Always fetch new dog
    gcTime: 1000 * 60 * 5,
  });
};

// Dog Breeds
export const useDogBreeds = () => {
  return useQuery({
    queryKey: ['dogBreeds'],
    queryFn: async () => {
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      if (!response.ok) throw new Error('Failed to fetch breeds');
      const data = await response.json();
      return data.message;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (breeds don't change often)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Cat Facts
export const useCatFact = () => {
  return useQuery({
    queryKey: ['catFact'],
    queryFn: async () => {
      const response = await fetch('https://catfact.ninja/fact');
      if (!response.ok) throw new Error('Failed to fetch cat fact');
      return response.json();
    },
    staleTime: 0, // Always get new fact
    gcTime: 1000 * 60 * 5,
  });
};

// Random Quote
export const useRandomQuote = () => {
  return useQuery({
    queryKey: ['randomQuote'],
    queryFn: async () => {
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) throw new Error('Failed to fetch quote');
      return response.json();
    },
    staleTime: 0, // Always get new quote
    gcTime: 1000 * 60 * 5,
  });
};

// Activity Suggestion
export const useActivitySuggestion = () => {
  return useQuery({
    queryKey: ['activity'],
    queryFn: async () => {
      const response = await fetch('https://www.boredapi.com/api/activity');
      if (!response.ok) throw new Error('Failed to fetch activity');
      return response.json();
    },
    staleTime: 0, // Always get new activity
    gcTime: 1000 * 60 * 5,
  });
};

// GitHub Repository Info
export const useGitHubRepo = (owner: string, repo: string) => {
  return useQuery({
    queryKey: ['github', owner, repo],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!response.ok) throw new Error('Failed to fetch repo');
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// IP Address
export const useMyIP = () => {
  return useQuery({
    queryKey: ['myIP'],
    queryFn: async () => {
      const response = await fetch('https://httpbin.org/ip');
      if (!response.ok) throw new Error('Failed to fetch IP');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Age Prediction
export const useAgePrediction = (name: string) => {
  return useQuery({
    queryKey: ['agePrediction', name],
    queryFn: async () => {
      const response = await fetch(`https://api.agify.io?name=${name}`);
      if (!response.ok) throw new Error('Failed to predict age');
      return response.json();
    },
    enabled: name.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (predictions don't change)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

// Nationality Prediction
export const useNationalityPrediction = (name: string) => {
  return useQuery({
    queryKey: ['nationalityPrediction', name],
    queryFn: async () => {
      const response = await fetch(`https://api.nationalize.io?name=${name}`);
      if (!response.ok) throw new Error('Failed to predict nationality');
      return response.json();
    },
    enabled: name.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

// Simulated Delayed Response for testing loading states
export const useDelayedData = (delaySeconds: number = 3) => {
  return useQuery({
    queryKey: ['delayed', delaySeconds],
    queryFn: async () => {
      const response = await fetch(`https://httpbin.org/delay/${delaySeconds}`);
      if (!response.ok) throw new Error('Failed to fetch delayed response');
      return response.json();
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};

// Simulated Error Response for testing error states
export const useErrorResponse = (statusCode: number = 500) => {
  return useQuery({
    queryKey: ['error', statusCode],
    queryFn: async () => {
      const response = await fetch(`https://httpbin.org/status/${statusCode}`);
      if (!response.ok) {
        throw new Error(`Server returned ${statusCode}: ${response.statusText}`);
      }
      return response.text();
    },
    retry: false, // Don't retry on error for testing
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};

// LARGE DATA ENDPOINTS FOR PERFORMANCE TESTING

// Large JSON from HTTPBin (generates specified bytes of JSON)
export const useLargeJSON = (megabytes: number = 5) => {
  const bytes = megabytes * 1024 * 1024;
  return useQuery({
    queryKey: ['largeJSON', megabytes],
    queryFn: async () => {
      // HTTPBin can generate up to 100KB, so we'll use multiple requests or alternatives
      const response = await fetch(`https://httpbin.org/bytes/${Math.min(bytes, 102400)}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch large data');
      
      // For truly large data, generate it client-side
      if (megabytes > 0.1) {
        // Generate large JSON object
        const largeData = {
          metadata: {
            size: `${megabytes}MB`,
            generated: new Date().toISOString(),
            source: 'Client-side generation',
          },
          data: Array.from({ length: megabytes * 10000 }, (_, i) => ({
            id: i,
            uuid: crypto.randomUUID ? crypto.randomUUID() : `${i}-${Date.now()}`,
            timestamp: Date.now() + i,
            value: Math.random(),
            nested: {
              level1: {
                level2: {
                  level3: {
                    value: Math.random() * 1000,
                    text: `Item ${i} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
                  }
                }
              }
            },
            tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'].map(t => `${t}-${i}`),
            description: `This is item number ${i} with random value ${Math.random()}`,
          })),
        };
        return largeData;
      }
      
      return response.arrayBuffer();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Large Pokemon Dataset (all Pokemon with details)
export const useAllPokemon = () => {
  return useQuery({
    queryKey: ['allPokemon'],
    queryFn: async () => {
      // First get the list of all Pokemon (currently ~1300)
      const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
      if (!listResponse.ok) throw new Error('Failed to fetch Pokemon list');
      const listData = await listResponse.json();
      
      // Fetch details for each Pokemon (this creates a large dataset)
      const detailPromises = listData.results.slice(0, 50).map(async (pokemon: any) => {
        const detailResponse = await fetch(pokemon.url);
        return detailResponse.json();
      });
      
      const allDetails = await Promise.all(detailPromises);
      
      return {
        count: listData.count,
        totalFetched: allDetails.length,
        pokemon: allDetails,
        sizeEstimate: '~2-3MB',
      };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

// Large User Dataset
export const useLargeUserDataset = (count: number = 1000) => {
  return useQuery({
    queryKey: ['largeUserDataset', count],
    queryFn: async () => {
      // Fetch in batches to create large dataset
      const batchSize = 100;
      const batches = Math.ceil(count / batchSize);
      const allUsers = [];
      
      for (let i = 0; i < batches; i++) {
        const response = await fetch(`https://randomuser.me/api/?results=${Math.min(batchSize, count - i * batchSize)}&seed=${i}`);
        if (!response.ok) throw new Error('Failed to fetch users batch');
        const data = await response.json();
        allUsers.push(...data.results);
      }
      
      return {
        totalUsers: allUsers.length,
        sizeEstimate: `~${(allUsers.length * 5).toFixed(1)}KB`,
        users: allUsers,
        metadata: {
          fetched: new Date().toISOString(),
          batches: batches,
        }
      };
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// NASA Image Dataset (Large images and metadata)
export const useNASAImages = (query: string = 'mars', pageSize: number = 100) => {
  return useQuery({
    queryKey: ['nasaImages', query, pageSize],
    queryFn: async () => {
      const response = await fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image&page_size=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch NASA images');
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};

// GitHub Events (Large real-time dataset)
export const useGitHubEvents = () => {
  return useQuery({
    queryKey: ['githubEvents'],
    queryFn: async () => {
      const response = await fetch('https://api.github.com/events');
      if (!response.ok) throw new Error('Failed to fetch GitHub events');
      const events = await response.json();
      
      // Fetch additional details for each event to increase data size
      const enrichedEvents = await Promise.all(
        events.slice(0, 20).map(async (event: any) => {
          try {
            if (event.repo?.url) {
              const repoResponse = await fetch(event.repo.url);
              if (repoResponse.ok) {
                const repoData = await repoResponse.json();
                return { ...event, repoDetails: repoData };
              }
            }
          } catch {
            // Ignore errors for individual repo fetches
          }
          return event;
        })
      );
      
      return {
        totalEvents: events.length,
        enrichedCount: enrichedEvents.length,
        events: enrichedEvents,
        sizeEstimate: '~1-2MB',
      };
    },
    staleTime: 1000 * 30, // 30 seconds (events change frequently)
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Synthetic Large Dataset Generator
export const useSyntheticLargeData = (megabytes: number = 5) => {
  return useQuery({
    queryKey: ['syntheticLarge', megabytes],
    queryFn: async () => {
      // Generate large synthetic dataset
      const itemCount = megabytes * 1000; // Roughly 1KB per item
      
      const generateItem = (index: number) => ({
        id: index,
        uuid: `${index}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        user: {
          id: Math.floor(Math.random() * 10000),
          name: `User ${index}`,
          email: `user${index}@example.com`,
          avatar: `https://picsum.photos/seed/${index}/200/200`,
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(5),
        },
        metrics: {
          views: Math.floor(Math.random() * 100000),
          likes: Math.floor(Math.random() * 10000),
          shares: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 500),
        },
        content: {
          title: `Post Title ${index}`,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '.repeat(10),
          tags: Array.from({ length: 10 }, (_, i) => `tag-${i}-${index}`),
          categories: ['tech', 'news', 'tutorial', 'update'].slice(0, Math.floor(Math.random() * 4) + 1),
        },
        nested: {
          level1: {
            data: Array.from({ length: 5 }, (_, i) => ({
              key: `L1-${i}`,
              value: Math.random(),
            })),
            level2: {
              data: Array.from({ length: 3 }, (_, i) => ({
                key: `L2-${i}`,
                value: Math.random() * 100,
              })),
            },
          },
        },
      });
      
      const data = {
        metadata: {
          generated: new Date().toISOString(),
          size: `~${megabytes}MB`,
          itemCount: itemCount,
          version: '1.0.0',
        },
        items: Array.from({ length: itemCount }, (_, i) => generateItem(i)),
        summary: {
          totalItems: itemCount,
          averageSize: `~${(1024).toFixed(0)} bytes per item`,
          estimatedSize: `${megabytes}MB`,
        },
      };
      
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 45, // 45 minutes
  });
};