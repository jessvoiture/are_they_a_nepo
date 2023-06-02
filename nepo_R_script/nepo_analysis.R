require(dplyr)
require(tidyr)
require(ggplot2)
require(ggbeeswarm)
require(packcircles)
require(stringr)
require(readr)

setwd <- "~/Documents/J/github/are_they_a_nepo/"
poptv <- read.csv("~/Documents/J/github/are_they_a_nepo/datasets/MostPopularTVs.csv") %>%
  mutate(type = "tv") %>%
  select(-rankUpDown) 
popmov <- read.csv("~/Documents/J/github/are_they_a_nepo/datasets/MostPopularMovies.csv") %>%
  select(-rankUpDown) %>%
  mutate(type = "film")
topmov <- read.csv("~/Documents/J/github/are_they_a_nepo/datasets/Top250Movies.csv") %>%
  mutate(type = "film")
toptv <- read.csv("~/Documents/J/github/are_they_a_nepo/datasets/Top250TVs.csv") %>%
  mutate(type = "tv")
box <- read.csv("~/Documents/J/github/are_they_a_nepo/datasets/BoxOfficeAllTime.csv") %>%
  distinct(id, .keep_all = TRUE) %>% 
  mutate(gross = parse_number(worldwideLifetimeGross))

df_bind <- rbind(poptv, popmov, topmov, toptv)

df_cast <- df_bind %>%
  group_by(id) %>%
  distinct() %>%
  ungroup() %>%
  filter(pct_nepo > 0) %>%
  filter(nepos != "False")

df_rep <- df_cast %>%
  distinct(cast, id, .keep_all = T) %>%
  group_by(cast) %>%
  summarise(tot = n(),
            titles = toString(unique(fullTitle)))

df <- df_bind %>%
  group_by(id, title, year, type, pct_nepo, imDbRating) %>%
  distinct() %>%
  summarise(tot = n(),
            nepo_count = sum(nepos != "False")) %>%
  mutate(pct_nepo = replace(pct_nepo, is.na(pct_nepo), 0))

df_nozero <- df %>%
  filter(pct_nepo > 0)

filmtv <- df_nozero %>%
  group_by(type) %>%
  summarise(n())

tot <- df %>%
  group_by(type) %>%
  summarise(n()) 

p <- ggplot(df_nozero, aes(x=pct_nepo)) + 
  geom_histogram()

p

pl <- ggplot(df_nozero, aes(x=imDbRating,
                      y=pct_nepo,
                     color=as.factor(type))) + 
  geom_point()

pl


pct <- ggplot(df, aes(x=tot,
                            y=nepo_count,
                            color=as.factor(type))) + 
  geom_point()

pct
