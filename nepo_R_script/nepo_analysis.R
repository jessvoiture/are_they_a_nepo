require(dplyr)
require(purrr)
require(rjson)
require(jsonlite)
require(ggplot2)
require(tidyverse)
require(readr)
require(tidyr)
require(igraph)
require(ggprah)

topmov <- read.csv("/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/Top250Movies.csv")
popmov <- read.csv("/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/MostPopularMovies.csv")
toptv <- read.csv("/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/Top250TVs.csv")
poptv <- read.csv("/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/MostPopularTVs.csv")

cols_of_interest <- c("id", "title", "year", "image", "cast_length", "cast", "pct_nepo")
group_cols <- c("id", "title", "year", "image", "type", "cast_length", "pct_nepo")

topmov <- topmov %>%
  select(all_of(cols_of_interest)) %>%
  mutate(type = "film")

popmov <- popmov %>%
  select(all_of(cols_of_interest)) %>%
  mutate(type = "film")

toptv <- toptv %>%
  select(all_of(cols_of_interest)) %>%
  mutate(type = "tv")

poptv <- poptv %>%
  select(all_of(cols_of_interest)) %>%
  mutate(type = "tv")

df <- bind_rows(topmov, popmov, toptv, poptv)

df1 <- df %>%
  group_by(across(all_of(group_cols))) %>% 
  summarise(cast_list = list(unique(cast)))

x <- toJSON(df1)

# write(x, "/Users/jessicacarr/Documents/J/github/are_they_a_nepo/nepo_data/all-nepo.json")


# seeing something --------------------------------------------------------

df1 <- df %>%
  distinct(title, .keep_all = T) 

h <- ggplot(df1, aes(log(pct_nepo))) +
  geom_histogram() +
  facet_wrap(vars(type))

h

type_count <- df %>%
  distinct(title, .keep_all = T) %>%
  group_by(type) %>%
  summarise(avg_pct = mean(pct_nepo),
            count = n(),
            count_nepos  = sum(pct_nepo > 0),) %>%
  mutate(nepo_to_non_nepo = count_nepos / count)

film_subset <- subset(df, type == "film")
tv_subset <- subset(df, type == "tv")

# Conduct t-test
t_test_result <- t.test(film_subset$pct_nepo, tv_subset$pct_nepo)
t_test_result

wilcox.test(film_subset$pct_nepo, tv_subset$pct_nepo)

t.test(film_subset$pct_nepo, tv_subset$pct_nepo, alternative = "two.sided", var.equal = FALSE)


# -------------------------------------------------------------------------

# expand cast column
df_cleaned <- df %>%
  mutate(cast = gsub("'", '"', cast)) %>%  # Replace single quotes with double quotes
  mutate(cast = gsub("\\{\\{|\\}\\}", "", cast)) %>%  # Remove extra curly braces
  mutate_all(str_remove_all, '"') %>%  # Remove remaining double quotes
  separate(cast, into = c("nonsense","name", "image", "link", "nepo", "parents"),
           sep = 'name:|, image:|, link:|, nepo:|, parents:') %>%
  select(-c(parents, nonsense, image))

unique_all <- length(unique(df_cleaned$name))
df_count_per_cast <- df_cleaned %>%
  group_by(name, nepo) %>%
  summarise(freq = n())

df_nepos <- df_cleaned %>%
  filter(nepo == " True")

unique_nepos <- length(unique(df_nepos$name))



# duplicate nepos ---------------------------------------------------------
nepos <- df_cleaned %>%
  filter(nepo == " True") %>%
  group_by(name, type) %>%
  summarise(freq=n()) %>%
  ungroup() %>%
  group_by(type) %>%
  summarise(average = mean(freq))

tv_film_nepo_count <- df_cleaned %>%
  filter(nepo == " True") %>%
  group_by(type) %>%
  summarise(freq=n())
