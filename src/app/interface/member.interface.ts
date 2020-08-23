export interface MemberHttpResponse {
    success: boolean,
    count: number,
    list: [
        {
            type?: string,
            m_id?: number,
            _id?: number,
            name?: string
        }
    ]
}