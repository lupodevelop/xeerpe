export interface ArticleJsonLdPage {
    title: string
    description?: string
    path: string
    updatedAt?: string
}

export interface SocialMetadataPage {
    title: string
    description?: string
    path: string
    type?: 'website' | 'article'
}
