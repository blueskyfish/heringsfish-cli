package com.example.demo.resource;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("/version")
public class VersionResource {

    @GET
    public Response getVersion() {
        return null;
    }
}
