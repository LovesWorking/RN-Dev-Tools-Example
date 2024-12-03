import { useQuery } from "@tanstack/react-query";

const fetchPokemon = async (pokemonName: string) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const usePokemon = (pokemonName: string) => {
  return useQuery({
    queryKey: [`Pokemon-${pokemonName}`],
    queryFn: () => fetchPokemon(pokemonName),
  });
};
