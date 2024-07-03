export interface VidAngelBaseResponse<T> {
  next?: string
  previous?: string
  results: T[]
}

export interface VidAngelMovieTitle {
  id: number
  title: string
  tagCount: number
  offerings: {
    tag_set_id: number
  }[]
}

export interface VidAngelFilter {
  id: number
  tags: {
    begin: number
    end: number
    start_approx: number
    end_approx: number
    ref_id: string

    id: number
    description: string
    category_id: number
    type: "audio" | "audiovisual"
  }[]
}

export interface VidAngelCategory {
  id: number
  display_title: string
  default_type: string
  key: string
  parent_id: number
  ordering: number
}
