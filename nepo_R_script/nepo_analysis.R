require(dplyr)
require(purrr)
require(rjson)
require(jsonlite)

topmov <- read.csv("/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/Top250Movies.csv")
popmov <- read.csv("/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/MostPopularMovies.csv")
toptv <- read.csv("/Users/jessiscacarr/Documents/J/github/are_they_a_nepo/nepo_data/Top250TVs.csv")
poptv <- read.csv("/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/MostPopularTVs.csv")

cols_of_interest <- c("id", "title", "year", "image", "cast_length", "cast", "pct_nepo")
group_cols <- c("id", "title", "year", "image", "type", "cast_length", "pct_nepo")

topmov <- topmov %>%
  select(cols_of_interest) %>%
  mutate(type = "film")

popmov <- popmov %>%
  select(cols_of_interest) %>%
  mutate(type = "film")

toptv <- toptv %>%
  select(cols_of_interest) %>%
  mutate(type = "tv")

poptv <- poptv %>%
  select(cols_of_interest) %>%
  mutate(type = "tv")

df <- bind_rows(topmov, popmov, toptv, poptv)

df1 <- df %>%
  group_by(across(all_of(group_cols))) %>% 
  summarise(cast_list = list(unique(cast)))

x <- toJSON(df1)

write(x, "/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/all-nepo.json")

