---
title: 'Starting a Blog Site'
description: 'Creating a blog site using Astro framework'
pubDate: 'Jul 06 2023'
heroImage: '../../assets/placeholder-social.jpg'
---
I keep on top of most things in life. However, one of my greatest weaknesses is documenting my work and progress on projects as I go along. In an effort to remedy this, I decided to produce a blog where I can post my doings.

I have built websites in the past. I wrote some basic PHP sites in my teenager years, developed a responsive site with Meteor.js during college, and recently developed an online application for attendance and organization using Express.js. All of these sites are now defuct as they were either personal learning challenges or for temporary use.

# Astro Framework
When building this site I had to decide what framework to use. Other than Express.js, the tools I have used in the past are either defunct or too heavy for a simple blog site. I needed something that would minimize the amount of network traffic per user to keep my costs down and not require much maintenance. Searching for these criteria led me to the [Astro framework](astro.build). By default, little to no javascript is served to the user with the option to integrate tools as needed such as React, TailwindCSS, Pictionary, and many more. After a few hours of tinkering with the default blog template provided I was able to serve pages with multiple pictures in ~100ms in under 10kB, which is very impressive. On top of this, it includes support for Markdown files which makes implementing new posts and content a breeze. Extended Markdown (.mdx) can pull variables from the server if dynamic content is needed.

While I have been wading through the muck successfully, one of the issues with this framework is the documentation and seemingly endless nested file structure. Breaking changes have occurred through the version iterations of the framework, which is expected for something this new, but these changes aren't reflected completely in the documentation. I wanted to use their newest addition, content collections, as a way to organize blog posts and also provide a way to paginate the posts in a listing. There is an official module for pagination in the documentation under routing, an insertion of the recently updated content collection under routing, but no method on how to implement pagination on a content collection. The Internet did not provide a solution for this one either. I managed to clue it out with some trial and error while referencing pieces and parts of the documentation, and I will make a post on how to do that one.

The file structure is built with a key goal in mind: organization. The basic file structure, as of the writing of this post, looks like the following:

```
├─── public
├─── src
|    ├─── assets
|    ├─── components
|    ├─── content
|    ├─── layouts
|    └─── pages
└─── astro.config.mjs
```

There are more files included in the basic template but since they typically need to be left unmodified, I will skip over them.

## public
```public``` is the same universally standard folder for fonts, images, and other assets. However, any image used from this folder will not be compressed/optimized with the current version of Astro. For that, see the [assets](#assets) folder.

## src
```src``` is the "everything" source code folder. Nothing here is directly exposed and is processed by the server before being served as lightweight HTML to the user.

## assets
```assets``` contains all images that are processed by Astro's built-in image optimization. It is in the experimental stage as of writing. You insert an ```<Image />``` component with configuration features such as size, quality, and format. I love this feature. I can simply drop in any image with no modifications and let the framework handle all the optimization. Being able to automatically change the format from ```.jpg``` or ```.png``` to something much more optimized like ```.webp``` with 10-12 characters of option text is fantastic. My high quality pictures taken from my Pixel 5a phone convert from 2MB to as small as 1kB with little to no change in viewer experience with the right toggles. It took me, a novice in front end, around 5 minutes to grasp the concept of assets in Astro. Huge props for this feature. [Assets documentation.](https://docs.astro.build/en/guides/assets/)

## components
```components``` contains templated HTML to insert into other pages. You want to define fairly static content here such as a site header, site footer, global imports, etc. These files are defines using Astro's ```.astro``` features, and can be imported into other documents just like a Javascript file.

## content
```content``` contains all written content to be called and served through another one of Astro's features: Content Collections. From the documentation, the purpose of this is to streamline organization and TypeScript safety (file type validation). There is too much to cover on this one so without digging too deep, you organize related groups of content together in folders, create a schema, or collection, in a config file that describes what is inside each piece of content, then call that collection in other pages when needed.

Here's an example layout:

```
content
├─── blog
|    ├─── blog-post-1.md
|    ├─── blog-post-2-fancy.mdx
|    ├─── blog-post-3.md
|    └─── blog-post-4.md
├─── store
|    ├─── cool-gadget.md
|    └─── hot-item.md
└─── config.ts
```

In here you have two collections: blog and store. Inside each collection is a file that contains the content with a YAML header containing variables that describe the content such as title, date, description, header image, etc.

```
---
title: '[How To] Baking a Cake'
description: 'This is my blog post on how to bake a cake!'
tags: ['baking', 'guide']
pubDate: 'Jul 06 2023'
headerImage: '../../assets/kitchen-wide.jpg'
---

Here is the body text in Markdown format where I will describe how to bake a cake and bla bla bla...
```

Once you have your files created in your collections you define a schema in ```config.ts``` for both blog and store using Astro's included third-party validation tool [Zod](https://github.com/colinhacks/zod). It has several configurations and a lot of documentation, but its ultimate goal is to ensure every variable you submitted in the YAML header is defined with its correct variable type to pass TypeScript validation. Once this is done you can call the collections to your templated blog post or store item page to display.

This organization is very simple and concise, but such a structure limits you to just that: simple. You will need to come up with a reasonable naming scheme for each file if you plan to make a collection with lots of content to avoid naming conflicts. Collections cannot be nested; if you want to make a 'guides' and 'self' collection inside of the 'blog' collection you are unable to do so. You can, however, make subdirectories inside the 'blog' collection and they will appear as additional segments in the url scheme. [Content Collection documentation.](https://docs.astro.build/en/guides/content-collections/)

## layouts
```layouts``` contains all templated HTML, just like a [component](#components), but for templates that wrap around the new Astro [Content Collection](#content). You can call the YAML variables and add styling that will be shared with each piece of content passed through the files here. For my setup, I have a ```blogPost.astro``` template that calls my collection of blog posts, defines the HTML and styling for a blog post, and inserts each piece of content in the collection file into the blog post template. This together creates the viewable page. By editing the template, every blog post will be altered in the same way.

## pages
```pages``` is where Astro gets confusing. The pages folder contains leftovers of Astro's v1.0 file based routing as well as Astro's v2.0 content collection routing scheme.

As a part of the old file based routing, if you make a ```foo.astro``` file in the root directory of this folder, it will be pulled for page loading when a GET request to ```www.website.com/foo``` is made. If you nest the same page in a folder called ```bar```, the resulting URL link is ```www.website.com/bar/foo```. Each of the ```.astro``` files can contain framework specific content to implement layouts, filtering, and much more.

Content collections can be referenced by using special naming schemes. If a file is named ```[...slug].astro``` and your entire blog collection is called inside the file, every blog collection will be inserted into the URL ```www.website.com/blog-post-file-name```. This makes it extra important that every file name in the collection is meaningful and unique. [Pages documentation.](https://docs.astro.build/en/core-concepts/astro-pages/)

## astro.config.mjs
```astro.config.mjs``` changes how Astro is built. Here you can toggle experimental features, such as [assets](#assets), load sensitive files, such as passwords and keys, and modify how it handles file and folder I/O. You will modify this file when the documentation instructs you to.

# Remarks on Astro
As someone who has limited experience in front end development, the default Markdown support was immensely helpful in getting a stylized page off the ground. When writing a post, the only styling I need to concern myself with are the very short Markdown syntax calls and the variables included in the YAML header of each post.

While Markdown does not assist in the processing of images aside from displaying them, Astro comes with an incredibly easy to use Image component that fills this void. My only concerns with images now are taking them and ensuring the relevant object in the image is in the center when taking the picture.

The site styling is lacking by default. With my constant back and forth referencing CSS tricks, testing, and referencing again, it took me a full work day's worth of effort to stylize a paginated blog post listing page. That said, these are the "do it once and never again" portions of styling the site. The common approach that I see on [other examples](https://astro.build/themes) is to use Tailwind CSS. This is an integration I haven't utilized before but when I'm ready to jazz up the blog I'm sure I will look into it. For now I'm satisfied with getting started on the ground floor with the intention of getting info out there.

The backend, which seems to be the main focus of this framework, is fairly hands off. There's no need to put my hands on it either; it creates extremely optimized pages all on its own and handles all the routing just by choosing where to place files. The lightweightedness of the framework was the main selling point for me, and while the backend is something I can tackle, I won't complain about not needing to tinker with it. Saves me time!