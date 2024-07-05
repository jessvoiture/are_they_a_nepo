Sniffing out the nepo babies.

# Data files

### Output.json

For each film contains

- title: title of the film
- id: imdb id
- year: year of release(s)
- image: title poster
- link: imdb title link
- cast_len: length of cast
- cast: cast members
  - name: name of actor
  - image: cast member iamge
  - link: wiki link for cast member
  - nepo: whether cast member is a nepo babe
  - parents: list of cast member's parents
    - name: name of parent
    - image: image of parent
    - link: wiki link for parent

```
{
    "title": string,
    "id": string,
    "year": string,
    "image": string,
    "link": string,
    "type": string,
    "cast_len": int,
    "cast": [
      {
        "name": string,
        "image": string,
        "link": string,
        "nepo": bool,
        "parents": [
          {
            "name": string,
            "image": string,
            "link": string
          },
        ]
      }
    ]
}
```

### nepo_just_cast_data_no_parent_data.csv

Pretty much what is says on the can.

title / id / year / image / link / type / cast_len / cast_names / cast_links / cast_image / cast_link / cast_nepo
