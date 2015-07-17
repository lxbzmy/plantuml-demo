/*
 * Copyright 2012-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.devit.util.plantuml;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.DispatcherType;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;

import org.springframework.beans.BeansException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.cache.ehcache.EhCacheManagerFactoryBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;

@Configuration
@ComponentScan
@EnableCaching(proxyTargetClass = true)
@EnableAutoConfiguration
public class ApplicationSetup extends SpringBootServletInitializer
        implements ResourceLoaderAware, ApplicationContextAware,
        ServletContextAware {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ApplicationSetup.class);
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(ApplicationSetup.class, args);
    }

    private ResourceLoader resourceLoader;
    private ApplicationContext applicationContext;
    private ServletContext servletContext;

    @Bean
    public EhCacheManagerFactoryBean eh() {
        EhCacheManagerFactoryBean factory = new EhCacheManagerFactoryBean();
        factory.setAcceptExisting(true);
        factory.setConfigLocation(resourceLoader
                .getResource("classpath:ehcache.xml"));
        return factory;

    }

    @Bean
    public CacheManager cacheManager() {

        EhCacheCacheManager ehCacheCacheManager = new EhCacheCacheManager();
        ehCacheCacheManager.setCacheManager(eh().getObject());
        ehCacheCacheManager.setTransactionAware(false);
        return ehCacheCacheManager;
    }

    @Bean
    public FilterRegistrationBean shallowEtagHeaderFilter() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(filter);
        registration.setDispatcherTypes(EnumSet.allOf(DispatcherType.class));
        registration.addUrlPatterns("/*");

        //TODO gzip.
        return registration;
    }

    @Bean
    AbstractHandlerMapping media() {
        // TODO ResourceHandlerRegistry

        Map<String, HttpRequestHandler> urlMap = new LinkedHashMap<String, HttpRequestHandler>();
        urlMap.put("media/**", mediaHandler("/media/"));
        urlMap.put("assets/**", mediaHandler("/assets/"));

        SimpleUrlHandlerMapping handlerMapping = new SimpleUrlHandlerMapping();
        handlerMapping.setOrder(Integer.MIN_VALUE + 1);
        handlerMapping.setUrlMap(urlMap);
        return handlerMapping;

    }

    public ResourceHttpRequestHandler mediaHandler(String path) {
        ResourceHttpRequestHandler requestHandler = new ResourceHttpRequestHandler();

        List<Resource> list = new ArrayList<Resource>(10);
        list.add(this.resourceLoader.getResource(path));

        requestHandler.setLocations(list);
        requestHandler.setApplicationContext(applicationContext);
        requestHandler.setServletContext(servletContext);
        return requestHandler;
    }

    @Override
    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException {
        this.applicationContext = applicationContext;
    }
}
