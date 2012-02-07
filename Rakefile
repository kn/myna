require 'rubygems'
require 'json'
require 'date'
require 'digest'

namespace :test do
  desc "Run JavaScript test suite"
  task :run do
    system "coffee -o ./src -c ./src/myna.coffee"
    system "coffee -o ./spec -c ./spec/myna_spec.coffee"
    system "open spec/spec_runner.html"
  end
end

desc "Run JavaScript test suite"
task :test => ['test:run']

directory "pkg"

task :build do
  puts "Compiling coffeescript..."
  system "coffee -o ./src -c ./src/myna.coffee"
  system "coffee -o ./spec -c ./spec/myna_spec.coffee"

  pkg = JSON.parse(File.read(File.join(File.dirname(__FILE__), 'package.json')))
  
  pkg_name = "myna-#{pkg["version"]}.js"
  puts "Building #{pkg_name}..."

  pkg_file = File.open(File.join(File.dirname(__FILE__), "pkg", pkg_name), "w")

  puts "Writing header..."
  header_comment = <<-COMMENT
/*!
 * myna #{pkg["version"]}
 *
 * Copyright 2012 Katsuya Noguchi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 */
  COMMENT
  pkg_file.write(header_comment)

  puts "Writing library..."
  js_file = File.open(File.join(File.dirname(__FILE__), "./src/myna.js"), "r")
  pkg_file.write(js_file.read)
  js_file.close

  pkg_file.close

  puts "Done building #{pkg_name}"
end