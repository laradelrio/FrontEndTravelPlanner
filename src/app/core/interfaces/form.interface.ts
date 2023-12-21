export interface Form {
    name: string, 
    label: string,
    type: string,
}

export interface ImgbbAPIResp {
    data:    ImgData;
    success: boolean;
    status:  number;
}

export interface ImgData {
    id:          string;
    title:       string;
    url_viewer:  string;
    url:         string;
    display_url: string;
    width:       number;
    height:      number;
    size:        number;
    time:        number;
    expiration:  number;
    image:       Image;
    thumb:       Image;
    delete_url:  string;
}

export interface Image {
    filename:  string;
    name:      string;
    mime:      string;
    extension: string;
    url:       string;
}